import { autorun, computed, observable } from "mobx";
import { Parameters, ROUTES, SceneNames, Stage } from "../scene";

/**
 * Returns a scene name and it's parameters object based on given URL.
 *
 * @param url URL string.
 */
const getStage = (url: string): Stage<SceneNames> => {
  forRoute: for (const route of Object.keys(ROUTES)) {
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

  return { sceneName: "unknown", parameters: {} };
};

/**
 * Returns an URL from a given stage.
 */
const getUrl = ({ sceneName, parameters }: Stage<SceneNames>): string => {
  forRoute: for (const route of Object.keys(ROUTES)) {
    // If route's scene is not stage's scene, skip.
    if (ROUTES[route as keyof typeof ROUTES] !== sceneName) {
      continue;
    }

    let url = route;

    if (parameters !== undefined) {
      // Replace all parameters with their values in parameters.
      for (const parameter of Object.keys(parameters)) {
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

  return window.location.pathname;
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
  @observable private mainStage: Stage<SceneNames>;

  /**
   * Creates a new instance of `ScenesStore` and adds listeners for main stage
   * change and history state pop events which update url and main stage
   * correspondingly.
   */
  public constructor() {
    this.mainStage = getStage(window.location.pathname);

    autorun(() => {
      const url = getUrl(this.mainStage);

      if (url === window.location.pathname) {
        return;
      }

      window.history.pushState(null, "", url);
    });

    window.addEventListener(
      "popstate",
      () => {
        this.mainStage = getStage(window.location.pathname);
      },
      false
    );
  }

  /**
   * Returns main stage object.
   */
  @computed
  public get main() {
    return this.mainStage;
  }

  /**
   * Sets main stage's scene name and parameters.
   *
   * @param sceneName
   * @param parameters
   */
  public redirect<TSceneName extends SceneNames>(
    sceneName: TSceneName,
    parameters: Parameters<TSceneName>
  ) {
    this.mainStage = { sceneName, parameters };
  }
}

/**
 * The only `ScenesStore` class instance and which is provided to all
 * components.
 */
export const scenes = new ScenesStore();
