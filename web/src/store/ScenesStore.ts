import { computed, observable, action } from "mobx";
import {
  GATEWAY_STAGE,
  getSceneUrl,
  getStageFromUrl,
  NO_AUTHENTICATION_SCENE_NAMES,
  Stage,
  UNKNOWN_STAGE
} from "../scene";
import { Alert, AlertNames, AlertParameters } from "../component/Alerts";
import { auth } from "./AuthStore";
import { translations } from "./TranslationsStore";

/**
 * Store that stores and updates all stages.
 *
 * It is also responsible for retrieving correct scene name and parameters based
 * on current URL and updating current URL if scene name or parameters were
 * changed.
 */
export class ScenesStore {
  /**
   * Current main stage.
   */
  @observable private _main!: Readonly<Stage>;

  /**
   * List of alerts.
   */
  @observable private _alerts: Array<Alert<AlertNames>> = [];

  /**
   * Set of reasons why waiting is needed.
   */
  @observable private _waits: Set<string> = new Set();

  /**
   * Creates a new instance of `ScenesStore` and adds listeners for main stage
   * change and history state pop events which update url and main stage
   * correspondingly.
   */
  public constructor() {
    this.update();
    window.addEventListener("popstate", () => this.update(), false);
  }

  /**
   * Returns a main stage object.
   */
  @computed
  public get main() {
    return this._main;
  }

  /**
   * Returns a list of alerts.
   */
  @computed
  public get alerts() {
    return this._alerts;
  }

  /**
   * Returns whether or not application is waiting for something.
   */
  @computed
  public get waiting() {
    return this._waits.size !== 0;
  }

  /**
   * Sets main stage's scene name and parameters.
   *
   * @param sceneName
   * @param parameters
   */
  @action
  public redirect(stage: Stage) {
    this._main =
      auth.authenticated !==
      NO_AUTHENTICATION_SCENE_NAMES.includes(stage.sceneName)
        ? stage
        : auth.authenticated
        ? UNKNOWN_STAGE
        : GATEWAY_STAGE;

    const url = getSceneUrl(stage) || window.location.pathname;
    const title = `${
      translations.translation.scenes[this._main.sceneName].title
    } - ${translations.translation.title}`;

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
    this.redirect(getStageFromUrl(window.location.pathname) || UNKNOWN_STAGE);
  }

  /**
   * Pushes an alert with name `name` and parameters `parameters` that will be
   * shown in `Alerts` component for `timeout` seconds.
   *
   * @param name Name of the alert.
   * @param parameters Alert's parameters.
   * @param timeout Time in seconds during which alert will be shown.
   */
  @action
  public pushAlert<TAlertName extends AlertNames>(
    name: TAlertName,
    parameters: AlertParameters<TAlertName>,
    timeout = 5
  ) {
    const alert = {
      id:
        Math.random()
          .toString(36)
          .substring(2) + Date.now().toString(36),
      name,
      parameters
    };

    this._alerts.push(alert);

    if (timeout !== 0) {
      setTimeout(this.popAlert, 1000 * timeout, alert);
    }
  }

  /**
   * Removes an alert with id `id` from alert list.
   */
  @action
  public popAlert = (alert: Alert<AlertNames>) => {
    const index = this._alerts.findIndex(other => other.id === alert.id);

    if (index === -1) {
      return;
    }

    this._alerts.splice(index, 1);
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

  /**
   * Whether or not navigation component should be visible.
   */
  @computed
  public get showNavigation() {
    return !NO_AUTHENTICATION_SCENE_NAMES.includes(this._main.sceneName);
  }
}

/**
 * The only `ScenesStore` class instance and which is provided to all
 * components.
 */
export const scenes = new ScenesStore();
