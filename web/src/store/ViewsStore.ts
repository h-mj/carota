import { Languages } from "api";
import { computed, observable, action } from "mobx";
import { Stage, Stages } from "../scene/Stage";
import { SceneNames } from "../scene/Scene";
import { Notifications } from "../component/NotificationContainer";
import { RootStore } from "./RootStore";
import { Translation } from "../translation";
import { english } from "../translation/english";
import { estonian } from "../translation/estonian";
import { russian } from "../translation/russian";

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
const NO_AUTHENTICATION_SCENE_NAMES: Readonly<Array<SceneNames>> = [
  "Login",
  "Register"
];

/**
 * Scene names that do not require navigation bar.
 */
const NO_NAVIGATION_SCENE_NAMES: Readonly<Array<SceneNames>> = [
  "Login",
  "Logout",
  "Register"
];

/**
 * Store that stores information about current state of the view, including
 * language, main stage, active notifications, and waiting reasons.
 *
 * It is also responsible for retrieving correct scene name and parameters based
 * on current URL and updating current URL if main stage was changed.
 */
export class ViewsStore {
  /**
   * Current interface language.
   */
  @observable private _language: Languages = "English";

  /**
   * Main stage.
   */
  @observable private _main!: Stages; // Set by calling `update` in constructor.

  /**
   * Side stage.
   */
  @observable private _side?: Stages;

  /**
   * Array of notifications.
   */
  @observable private _notifications: Array<Notifications> = [];

  /**
   * Set of reasons why waiting is needed.
   */
  @observable private _waits: Set<string> = new Set();

  /**
   * RootStore instance.
   */
  private _rootStore: RootStore;

  /**
   * Creates a new instance of `ScenesStore`, updates main scene based on
   * current URL and adds a history stage pop listener that also updates main
   * stage based on changed pathname.
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
   * Returns main stage object.
   */
  @computed
  public get main() {
    return this._main;
  }

  /**
   * Returns side stage object.
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
   * Returns whether or not application is waiting for something.
   */
  @computed
  public get waiting() {
    return this._waits.size !== 0;
  }

  /**
   * Whether or not body overflow should be hidden so that user can not scroll.
   */
  @computed
  public get hideOverflow() {
    return this.waiting || this.side !== undefined;
  }

  /**
   * Returns navigation item stages.
   */
  @computed
  public get navigation() {
    if (NO_NAVIGATION_SCENE_NAMES.includes(this.main.sceneName)) {
      return undefined;
    }

    return [
      new Stage("Home", {}, {}),
      new Stage("Diet", {}, {}),
      new Stage("Measurements", {}, {}),
      new Stage("History", {}, {}),
      new Stage("Administration", {}, {}),
      new Stage("Settings", {}, {}),
      new Stage("Logout", {}, {})
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
   * Sets main stage's scene name and parameters.
   *
   * This function also resets side stage.
   *
   * @param stage Stage that will be new main stage.
   */
  @action
  public redirect(stage: Stages) {
    const { authenticated } = this._rootStore.auth;

    // If user authentication status is the same as scene authentication requirement.
    if (
      !authenticated === NO_AUTHENTICATION_SCENE_NAMES.includes(stage.sceneName)
    ) {
      this._main = stage;
    } else {
      this._main = authenticated ? Stage.UNKNOWN : Stage.GATEWAY;
    }

    this.refocus();

    const url = stage.getUrl() || window.location.pathname;
    const title = `${this.translation.scenes[this._main.sceneName].title} - ${
      this.translation.title
    }`;

    if (url !== window.location.pathname) {
      window.history.pushState(null, title, url);
    }

    document.title = title;
  }

  /**
   * Redirects user to correct stage based on current pathname.
   */
  @action
  public update() {
    const { authenticated } = this._rootStore.auth;
    const stage = Stage.from(window.location.pathname);

    // If user is unauthenticated and tries to access the logout scene, redirect to home.
    if (!authenticated && stage !== undefined && stage.sceneName === "Logout") {
      return this.redirect(Stage.HOME);
    }

    this.redirect(Stage.from(window.location.pathname) || Stage.UNKNOWN);
  }

  /**
   * Sets a stage that will be rendered on the side.
   *
   * @param stage Stage that will be rendered on the side.
   */
  public aside(stage: Stages) {
    this._side = stage;
  }

  /**
   * Hides all stages except main stage.
   */
  public refocus() {
    this._side = undefined;
  }

  /**
   * Adds `notification` to notifications array and adds an `timeout` second
   * timeout after which the notification is removed from the array.
   *
   * @param notification New notification.
   * @param timeout Timeout in seconds after which notification is removed.
   */
  @action
  public notify(notification: Notifications, timeout = 5) {
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
   * Adds a waiting reason to the set.
   *
   * @param reason Loading procedure name.
   */
  @action
  public wait(reason: string) {
    this._waits.add(reason);
  }

  /**
   * Removes a waiting reason from the the set.
   *
   * @param name Loading procedure name.
   */
  @action
  public done(reason: string) {
    this._waits.delete(reason);
  }
}
