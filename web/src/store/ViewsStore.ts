import { Languages } from "api";
import { action, computed, observable } from "mobx";

import { Scene, Scenes } from "../base/Scene";
import { SceneComponentProps, SceneNames } from "../base/SceneComponent";
import {
  Notification,
  NotificationMessageParameters,
  NotificationNames,
  Notifications
} from "../component/NotificationContainer";
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
 * language, main and side scenes, active notifications, and waiting reasons.
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
   * Main scene.
   */
  @observable private _main: Scenes = Scene.UNKNOWN;

  /**
   * Side scene.
   */
  @observable private _side?: Scenes;

  /**
   * Array of notifications.
   */
  @observable private _notifications: Notifications[] = [];

  /**
   * Number of active loadings.
   */
  @observable private _loadingCount = 0;

  /**
   * RootStore instance.
   */
  private _rootStore: RootStore;

  /**
   * Creates a new instance of `ScenesStore`, updates main scene based on
   * current URL and adds a history state pop listener that also updates main
   * scene based on changed pathname.
   */
  public constructor(rootStore: RootStore) {
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
   * Returns main scene object.
   */
  @computed
  public get main() {
    return this._main;
  }

  /**
   * Returns side scene object.
   */
  public get side() {
    return this._side;
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
   * Whether or not body overflow should be hidden so that user can not scroll.
   */
  @computed
  public get hideOverflow() {
    return this.loading || this.side !== undefined;
  }

  /**
   * Returns a list of navigable scenes that will be included in
   * navigation bar.
   */
  @computed
  public get navigation() {
    if (NO_AUTHENTICATION_SCENE_NAMES.includes(this._main.name)) {
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
   * Sets main scene.
   *
   * This function also resets side scene.
   *
   * @param scene Scene that will be new main scene.
   */
  @action
  public redirect(scene: Scenes) {
    const { authenticated } = this._rootStore.auth;

    // If user authentication status is the same as scene's authentication
    // requirement.
    if (!authenticated === NO_AUTHENTICATION_SCENE_NAMES.includes(scene.name)) {
      this._main = scene;
    } else {
      this._main = authenticated ? Scene.UNKNOWN : Scene.GATEWAY;
    }

    this.refocus();

    const url = scene.getUrl();

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
    const { authenticated } = this._rootStore.auth;
    const scene = Scene.from(window.location.pathname);

    // If user is unauthenticated and tries to access the logout scene, redirect to home.
    if (!authenticated && scene !== undefined && scene.name === "Logout") {
      return this.home();
    }

    this.redirect(Scene.from(window.location.pathname) || Scene.UNKNOWN);
  }

  /**
   * Creates and sets a side scene.
   *
   * @param name Side scene name.
   * @param props Scene component props.
   */
  public aside<TSceneName extends SceneNames>(
    name: TSceneName,
    props: SceneComponentProps<TSceneName>
  ): void {
    this._side = new Scene(name, undefined, props) as Scenes;
  }

  /**
   * Hides all scenes except main.
   */
  public refocus() {
    this._side = undefined;
  }

  /**
   * Creates and adds a notification to notifications array and adds an
   * `timeout` second timeout after which the notification is removed from the
   * array.
   *
   * @param name Notification name.
   * @param parameters Notification message parameters.
   * @param timeout Timeout in seconds after which notification is removed.
   */
  @action
  public notify<TNotificationName extends NotificationNames>(
    name: TNotificationName,
    parameters: NotificationMessageParameters<TNotificationName>,
    timeout = 5
  ) {
    const notification = new Notification(name, parameters);

    this._notifications.push(notification);

    if (timeout > 0) {
      setTimeout(this.conceal, timeout * 1000, notification);
    }
  }

  /**
   * Removes a notification from notifications array.
   */
  @action
  public conceal = (notification: Notifications) => {
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
    return new Promise(resolve => setTimeout(resolve, 1000 * timeout));
  }
}
