import { Languages } from "api";
import { action, computed, observable } from "mobx";

import { RenderPosition, Scene, Scenes } from "../base/Scene";
import { SceneComponentProps, SceneNames } from "../base/SceneComponent";
import { Notification, NotificationType } from "../component/Notifications";
import { Translation } from "../translation";
import { english } from "../translation/english";
import { estonian } from "../translation/estonian";
import { russian } from "../translation/russian";
import { RootStore } from "./RootStore";

/**
 * Object that stores each language's translation object.
 */
const TRANSLATIONS: Readonly<Record<Languages, Translation>> = {
  English: english,
  Estonian: estonian,
  Russian: russian
};

/**
 * Scene names that do not require authentication.
 */
const NO_AUTHENTICATION_SCENE_NAMES: readonly SceneNames[] = [
  "Login",
  "Register"
];

/**
 * Store that stores information about current state of the view, including
 * language, active scenes, active notifications, and waiting reasons.
 *
 * It is also responsible for retrieving correct scene name and parameters based
 * on current URL and updating current URL on redirection.
 */
export class ViewsStore {
  /**
   * Current interface language.
   */
  @observable private _language: Languages = "English";

  /**
   * Array of active scenes.
   */
  @observable private _scenes: Scenes[];

  /**
   * Array of notifications.
   */
  @observable private _notifications: Notification[] = [];

  /**
   * Number of active loadings.
   */
  @observable private _loadingCount = 0;

  /**
   * RootStore instance.
   */
  private _rootStore: RootStore;

  /**
   * Creates a new instance of `ScenesStore`, updates root scene based on
   * current URL and adds a history state pop listener that also updates root
   * scene based on changed pathname.
   */
  public constructor(rootStore: RootStore) {
    this._scenes = [];
    this._rootStore = rootStore;

    this.update();
    window.addEventListener("popstate", () => this.update(), false);
  }

  /**
   * Returns translation object based on current interface language.
   */
  @computed
  public get translation() {
    return TRANSLATIONS[this._language];
  }

  /**
   * Returns an array of active scenes.
   */
  @computed
  public get scenes() {
    return this._scenes;
  }

  /**
   * Returns root scene.
   */
  @computed
  public get root() {
    return this._scenes[0];
  }

  /**
   * Returns an array of notifications.
   */
  @computed
  public get notifications() {
    return this._notifications;
  }

  /**
   * Returns whether or not application is loading something.
   */
  @computed
  public get loading() {
    return this._loadingCount > 0;
  }

  /**
   * Returns a list of navigable scenes that will be included in
   * navigation bar.
   */
  @computed
  public get navigation() {
    if (NO_AUTHENTICATION_SCENE_NAMES.includes(this.root.name)) {
      return undefined;
    }

    return [
      new Scene("Home", {}, {}),
      new Scene("Diet", {}, {}),
      new Scene("Measurements", {}, {}),
      new Scene("History", {}, {}),
      new Scene("Administration", {}, {}),
      new Scene("Settings", {}, {}),
      new Scene("Logout", {}, {})
    ];
  }

  /**
   * Sets interface language.
   *
   * @param language Language name.
   */
  public set language(language: Languages) {
    this._language = language;
  }

  /**
   * Sets root scene.
   *
   * This method also removes all active scenes except the root scene.
   *
   * @param scene Scene that will be new main scene.
   */
  @action
  public redirect(scene: Scenes) {
    const { authenticated } = this._rootStore.accounts;

    const url = scene.getUrl();

    // If user authentication status is opposite to scene's authentication
    // requirement, show unknown scene if user is authenticated, otherwise show
    // gateway (login) scene.
    if (authenticated === NO_AUTHENTICATION_SCENE_NAMES.includes(scene.name)) {
      scene = authenticated ? Scene.UNKNOWN : Scene.GATEWAY;
    }

    this._scenes = [scene];

    if (url !== window.location.pathname) {
      window.history.pushState(null, "", url);
    }
  }

  /**
   * Redirects user to home scene.
   */
  @action
  public home() {
    this.redirect(Scene.HOME);
  }

  /**
   * Updates main scene based on current URL and authentication status.
   */
  @action
  public update() {
    const { authenticated } = this._rootStore.accounts;
    const scene = Scene.from(window.location.pathname);

    // If user is unauthenticated and tries to access the logout scene, redirect to home.
    if (!authenticated && scene !== undefined && scene.name === "Logout") {
      return this.home();
    }

    this.redirect(scene || Scene.UNKNOWN);
  }

  /**
   * Adds a new active scene on top of the scenes array.
   *
   * @param position Render position where scene will be rendered to.
   * @param name Name of the scene.
   * @param props Scene component props.
   */
  @action
  public push<TSceneName extends SceneNames>(
    position: RenderPosition,
    name: TSceneName,
    props: SceneComponentProps<TSceneName>
  ): void {
    const scene = new Scene(name, undefined, props, position);

    this._scenes.push((scene as unknown) as Scenes);
  }

  /**
   * Hides all scenes that are before `scene` in active scene stack including the scene itself.
   */
  @action
  public pop(scene: Scenes) {
    if (!this._scenes.includes(scene)) {
      return;
    }

    while (this._scenes.pop() !== scene);
  }

  /**
   * Creates a notification with given text and type and adds it to an array of
   * active notifications. If timeout is not zero, timeout is created which
   * removes the notification after `timeout` seconds.
   *
   * @param text Notification text.
   * @param type Type of the notification, which affects the styling.
   * @param timeout Timeout in seconds after which notification is concealed.
   */
  @action
  public notify(text: string, type: NotificationType, timeout = 5) {
    const notification: Notification = observable({
      id:
        Math.random()
          .toString(36)
          .substring(2) + Date.now().toString(36),
      text,
      type
    });

    this._notifications.push(notification);

    if (timeout > 0) {
      window.setTimeout(this.conceal, 1000 * timeout, notification);
    }
  }

  /**
   * Removes a notification from notifications array.
   *
   * @param notification The notification which will be removed.
   */
  @action
  public conceal = (notification: Notification) => {
    const index = this._notifications.indexOf(notification);

    if (index === -1) {
      return;
    }

    this._notifications.splice(index, 1);
  };

  /**
   * Awaits a `promise` and returns its result after at least `timeout` seconds.
   *
   * @param promise Result promise.
   * @param timeout Timeout in seconds after at least this duration result will
   * be returned.
   */
  @action
  public async load<T>(promise: T | Promise<T>, timeout = 1) {
    ++this._loadingCount;
    const [result] = await Promise.all([promise, this.wait(timeout)]);
    --this._loadingCount;

    return result;
  }

  /**
   * Returns a promise that will be resolved after `timeout` seconds.
   */
  @action
  public async wait(timeout: number) {
    return new Promise(resolve => window.setTimeout(resolve, 1000 * timeout));
  }
}
