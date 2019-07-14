import { Languages } from "api";
import { computed, observable, action } from "mobx";
import { SceneContext, SceneContexts } from "../scene/SceneContext";
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
 * Store that stores information about current state of the view, including
 * language, main and side scene contexts, active notifications, and waiting
 * reasons.
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
   * Main scene context.
   */
  @observable private _main!: SceneContexts; // Set by calling `update` in constructor.

  /**
   * Side scene context.
   */
  @observable private _side?: SceneContexts;

  /**
   * Array of notifications.
   */
  @observable private _notifications: Array<Notifications> = [];

  /**
   * Set of active symbols created by `wait` method..
   */
  @observable private _waits: Set<symbol> = new Set();

  /**
   * RootStore instance.
   */
  private _rootStore: RootStore;

  /**
   * Creates a new instance of `ScenesStore`, updates main scene based on
   * current URL and adds a history state pop listener that also updates main
   * scene context based on changed pathname.
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
   * Returns main scene context object.
   */
  @computed
  public get main() {
    return this._main;
  }

  /**
   * Returns side scene context object.
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
   * Returns a list of navigable scene contexts that will be included in
   * navigation bar.
   */
  @computed
  public get navigation() {
    if (!this._rootStore.auth.authenticated) {
      return undefined;
    }

    return [
      new SceneContext("Home", {}, {}),
      new SceneContext("Diet", {}, {}),
      new SceneContext("Measurements", {}, {}),
      new SceneContext("History", {}, {}),
      new SceneContext("Administration", {}, {}),
      new SceneContext("Settings", {}, {}),
      new SceneContext("Logout", {}, {})
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
   * Sets main scene context.
   *
   * This function also resets side scene context.
   *
   * @param context Scene context that will be new main scene context.
   */
  @action
  public redirect(context: SceneContexts) {
    const { authenticated } = this._rootStore.auth;

    // If user authentication status is the same as scene authentication requirement.
    if (
      !authenticated ===
      NO_AUTHENTICATION_SCENE_NAMES.includes(context.sceneName)
    ) {
      this._main = context;
    } else {
      this._main = authenticated ? SceneContext.UNKNOWN : SceneContext.GATEWAY;
    }

    this.refocus();

    const url = context.getUrl() || window.location.pathname;

    if (url !== window.location.pathname) {
      window.history.pushState(null, "", url);
    }
  }

  /**
   * Updates main scene context based on current URL and authentication status.
   */
  @action
  public update() {
    const { authenticated } = this._rootStore.auth;
    const context = SceneContext.from(window.location.pathname);

    // If user is unauthenticated and tries to access the logout scene, redirect to home.
    if (
      !authenticated &&
      context !== undefined &&
      context.sceneName === "Logout"
    ) {
      return this.redirect(SceneContext.HOME);
    }

    this.redirect(
      SceneContext.from(window.location.pathname) || SceneContext.UNKNOWN
    );
  }

  /**
   * Sets a side scene context.
   *
   * @param context Side scene context.
   */
  public aside(context: SceneContexts) {
    this._side = context;
  }

  /**
   * Hides all scenes except main.
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
   * Creates and returns a unique symbol with given description and adds it to
   * waiting set. If waiting is done, `done` function should be called with
   * returned symbol, which removes the symbol from the waiting set.
   *
   * @param description Symbol description.
   */
  @action
  public wait(description?: string) {
    const symbol = Symbol(description);
    this._waits.add(symbol);
    return symbol;
  }

  /**
   * Removes a symbol from waiting list.
   *
   * @param symbol Symbol instance returned by wait.
   */
  @action
  public done(symbol: symbol) {
    this._waits.delete(symbol);
  }
}
