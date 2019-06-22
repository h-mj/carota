import { computed, observable, action } from "mobx";
import {
  Parameters,
  ROUTES,
  SceneNames,
  Stage,
  NO_AUTHENTICATION_SCENE_NAMES,
  GATEWAY_STAGE,
  UNKNOWN_STAGE
} from "../scene";
import { Alert, AlertNames, AlertParameters } from "../component/Alerts";
import { auth } from "./AuthStore";
import { translations } from "./TranslationsStore";

/**
 * Returns a scene name and it's parameters object based on given URL.
 *
 * @param url URL string.
 */
const getStage = (url: string): Stage<SceneNames> | undefined => {
  forRoute: for (const route in ROUTES) {
    const urlParts = url.split("/");
    const routeParts = route.split("/");

    if (urlParts.length !== routeParts.length) {
      continue;
    }

    const parameters: Parameters<SceneNames> = {};

    for (let i = 0; i < urlParts.length; ++i) {
      const urlPart = urlParts[i];
      const routePart = routeParts[i];

      if (routePart.startsWith("{") && routePart.endsWith("}")) {
        (parameters as any)[
          routePart.substring(1, routePart.length - 1)
        ] = urlPart;
      } else if (urlPart !== routePart) {
        continue forRoute;
      }
    }

    return {
      sceneName: ROUTES[route as keyof typeof ROUTES],
      parameters: parameters
    };
  }

  return undefined;
};

/**
 * Returns an URL from a given stage.
 */
const getUrl = <TSceneName extends SceneNames>({
  sceneName,
  parameters
}: Stage<TSceneName>): string | undefined => {
  forRoute: for (const route in ROUTES) {
    // If route's scene is not stage's scene, skip.
    if (ROUTES[route as keyof typeof ROUTES] !== sceneName) {
      continue;
    }

    let url = route;

    if (parameters !== undefined) {
      // Replace all parameters with their values in parameters.
      for (const parameter in parameters) {
        // If there's no such parameter, it's a wrong route.
        if (!url.includes(`{${parameter}}`)) {
          continue forRoute;
        }

        url = url.replace(`{${parameter}}`, (parameters as any)[parameter]);
      }
    }

    // If there are still parameters present in url, it's also a wrong route.
    if (url.match(/{.*}/) !== null) {
      continue;
    }

    return url;
  }

  return;
};

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
  @observable private _main!: Readonly<Stage<SceneNames>>;

  /**
   * List of alerts.
   */
  @observable private _alerts: Array<Alert<AlertNames>> = [];

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
   * Sets main stage's scene name and parameters.
   *
   * @param sceneName
   * @param parameters
   */
  @action
  public redirect<TSceneName extends SceneNames>(stage: Stage<TSceneName>) {
    this._main =
      auth.authenticated !==
      NO_AUTHENTICATION_SCENE_NAMES.includes(stage.sceneName)
        ? stage
        : auth.authenticated
        ? UNKNOWN_STAGE
        : GATEWAY_STAGE;

    const url = getUrl(stage) || window.location.pathname;
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
    this.redirect(getStage(window.location.pathname) || UNKNOWN_STAGE);
  }

  /**
   * Pushes an alert with name `name` and parameters `parameters` that will be
   * shown in `Alerts` component for `timeout` seconds.
   *
   * @param name Name of the alert.
   * @param parameters Alert's parameters.
   * @param timeout Time in seconds during which alert will be shown.
   */
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
  public popAlert = (alert: Alert<AlertNames>) => {
    const index = this._alerts.findIndex(other => other.id === alert.id);

    if (index === -1) {
      return;
    }

    this._alerts.splice(index, 1);
  };
}

/**
 * The only `ScenesStore` class instance and which is provided to all
 * components.
 */
export const scenes = new ScenesStore();
