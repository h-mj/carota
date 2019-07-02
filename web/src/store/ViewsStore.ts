import { Languages } from "api";
import { computed, observable, action } from "mobx";
import { Stage, Stages } from "../scene/Stage";
import { SceneNames } from "../scene/Scene";
import { Notifications } from "../component/NotificationContainer";
import { auth } from "./AuthStore";
import { Translation } from "../translation";
import { english } from "../translation/english";
import { estonian } from "../translation/estonian";
import { russian } from "../translation/russian";

/**
 * Object that stores each language's translation object.
 */
const TRANSLATIONS: Readonly<{ [Language in Languages]: Translation }> = {
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
   * Current main stage.
   */
  @observable private _main!: Readonly<Stages>;

  /**
   * Array of notifications.
   */
  @observable private _notifications: Array<Notifications> = [];

  /**
   * Set of reasons why waiting is needed.
   */
  @observable private _waits: Set<string> = new Set();

  /**
   * Creates a new instance of `ScenesStore`, updates main scene based on
   * current URL and adds a history stage pop listener that also updates main
   * stage based on changed pathname.
   */
  public constructor() {
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
   * Returns a main stage object.
   */
  @computed
  public get main() {
    return this._main;
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
   * Whether or not navigation component should be visible.
   */
  @computed
  public get showNavigation() {
    return !NO_NAVIGATION_SCENE_NAMES.includes(this._main.sceneName);
  }

  /**
   * Sets interface language.
   */
  public set language(language: Languages) {
    this._language = language;
  }

  /**
   * Sets main stage's scene name and parameters.
   *
   * @param sceneName
   * @param parameters
   */
  @action
  public redirect(stage: Stages) {
    this._main =
      auth.authenticated !==
      NO_AUTHENTICATION_SCENE_NAMES.includes(stage.sceneName)
        ? stage
        : auth.authenticated
        ? Stage.UNKNOWN
        : Stage.GATEWAY;

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
    const stage = Stage.from(window.location.pathname);

    // If user is unauthenticated and tries to access the logout scene, redirect to home.
    if (
      !auth.authenticated &&
      stage !== undefined &&
      stage.sceneName === "Logout"
    ) {
      return this.redirect(Stage.HOME);
    }

    this.redirect(Stage.from(window.location.pathname) || Stage.UNKNOWN);
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
   * Removes a waiting reason from the the set
   *
   * @param name Loading procedure name.
   */
  @action
  public done(reason: string) {
    this._waits.delete(reason);
  }
}

/**
 * The only `ScenesStore` class instance and which is provided to all
 * components.
 */
export const views = new ViewsStore();
