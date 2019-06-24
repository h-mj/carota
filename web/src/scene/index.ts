import { Administration } from "./Administration";
import { Diet } from "./Diet";
import { History } from "./History";
import { Home } from "./Home";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Measurements } from "./Measurements";
import { Register } from "./Register";
import { Scene } from "./Scene";
import { Settings } from "./Settings";
import { Unknown } from "./Unknown";

/**
 * Union of all scene classes.
 */
type Scenes =
  | Administration
  | Diet
  | History
  | Home
  | Login
  | Logout
  | Measurements
  | Register
  | Settings
  | Unknown;

/**
 * Union of all scene names.
 */
export type SceneNames = Scenes extends Scene<infer ISceneName>
  ? ISceneName
  : never;

/**
 * Object where scene names are mapped to its class. This object is used to
 * render a scene component using its name and change drawn scene by changing
 * the name of the current scene in `ScenesStore` store.
 */
export const SCENES: Readonly<{ [SceneName in SceneNames]: typeof Scene }> = {
  administration: Administration,
  diet: Diet,
  history: History,
  home: Home,
  login: Login,
  logout: Logout,
  measurements: Measurements,
  register: Register,
  settings: Settings,
  unknown: Unknown
};

/**
 * Defines a scene name and route parameter names for stages that can be
 * accessed by navigating to an URL that matches the key of this interface.
 *
 * If route parameter names type is `never`, then there are no parameters within
 * the path.
 */
interface Routes {
  "/administration": To<"administration">;
  "/diet": To<"diet">;
  "/history": To<"history">;
  "/": To<"home">;
  "/login": To<"login">;
  "/logout": To<"logout">;
  "/measurements": To<"measurements">;
  "/register/{invitationId}": To<"register", "invitationId">;
  "/settings": To<"settings">;
}

/**
 * Type that defines some route's scene name and route parameter names.
 */
interface To<
  TSceneName extends string,
  TParameterNames extends string = never
> {
  /**
   * Route parameter names type.
   */
  parameterNames: TParameterNames;

  /**
   * Route scene name.
   */
  sceneName: TSceneName;
}

/**
 * Union of all stage definitions that cannot be accessed by navigating to a
 * specific URL.
 */
type DeepStageProperties = To<"unknown", never>;

/**
 * Type that is a union of all possible parameter names to `string` mappings of
 * all routes, which scene name is one of the `TSceneNames` names.
 */
export type SceneParameters<TSceneNames extends string> =
  | Routes[keyof Routes]
  | DeepStageProperties extends infer ITypes
  ? ITypes extends To<infer ISceneName, infer IParameterNames>
    ? ISceneName extends TSceneNames
      ? { [ParameterName in IParameterNames]: string }
      : never
    : never
  : never;

/**
 * Object that maps all routes to their corresponding scene name. Used to
 * retrieve scene name based on current browser pathname.
 */
export const ROUTES: Readonly<
  { [Route in keyof Routes]: Routes[Route]["sceneName"] }
> = {
  "/administration": "administration",
  "/diet": "diet",
  "/login": "login",
  "/logout": "logout",
  "/history": "history",
  "/": "home",
  "/measurements": "measurements",
  "/register/{invitationId}": "register",
  "/settings": "settings"
};

/**
 * Returns a scene name and it's parameters object based on given URL.
 *
 * @param url URL string.
 */
export const getStageFromUrl = (url: string): Stage | undefined => {
  forRoute: for (const route in ROUTES) {
    const urlParts = url.split("/");
    const routeParts = route.split("/");

    if (urlParts.length !== routeParts.length) {
      continue;
    }

    const parameters: { [key: string]: string } = {};

    for (let i = 0; i < urlParts.length; ++i) {
      const urlPart = urlParts[i];
      const routePart = routeParts[i];

      if (routePart.startsWith("{") && routePart.endsWith("}")) {
        parameters[routePart.substring(1, routePart.length - 1)] = urlPart;
      } else if (urlPart !== routePart) {
        continue forRoute;
      }
    }

    return {
      sceneName: ROUTES[route as keyof Routes],
      parameters
    } as Stage;
  }

  return undefined;
};

/**
 * Returns an URL from a given stage.
 */
export const getSceneUrl = ({
  sceneName,
  parameters
}: Stage): string | undefined => {
  forRoute: for (const route in ROUTES) {
    // If route's scene is not stage's scene, skip.
    if (ROUTES[route as keyof Routes] !== sceneName) {
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
 * Union of all stages with scene name as `TSceneNames`, and parameters as
 * `SceneParameters` type of each scene name.
 */
export type Stage<TSceneNames extends SceneNames = SceneNames> = {
  [SceneName in TSceneNames]: {
    /**
     * Stage scene name.
     */
    sceneName: SceneName;

    /**
     * Scene parameters.
     */
    parameters: SceneParameters<SceneName>;
  }
}[TSceneNames];

/**
 * Scene names that do not require authentication.
 */
export const NO_AUTHENTICATION_SCENE_NAMES: Readonly<SceneNames[]> = [
  "login",
  "register"
];

/**
 * Stage that is shown if user is not authenticated but tries to access a stage
 * that requires authentication.
 */
export const GATEWAY_STAGE: Readonly<Stage> = {
  sceneName: "login",
  parameters: {}
};

/**
 * Stage that is shown if no other stages match current URL.
 */
export const UNKNOWN_STAGE: Readonly<Stage> = {
  sceneName: "unknown",
  parameters: {}
};
