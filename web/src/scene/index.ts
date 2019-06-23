import { Scene } from "./Scene";
import { Administration } from "./Administration";
import { Diet } from "./Diet";
import { History } from "./History";
import { Home } from "./Home";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Measurements } from "./Measurements";
import { Register } from "./Register";
import { Settings } from "./Settings";
import { Unknown } from "./Unknown";

/**
 * Union of all scene properties.
 */
type ScenesProperties =
  | SceneProperties<Administration, typeof Administration>
  | SceneProperties<Diet, typeof Diet>
  | SceneProperties<History, typeof History>
  | SceneProperties<Home, typeof Home>
  | SceneProperties<Login, typeof Login>
  | SceneProperties<Logout, typeof Logout>
  | SceneProperties<Measurements, typeof Measurements>
  | SceneProperties<Register, typeof Register>
  | SceneProperties<Settings, typeof Settings>
  | SceneProperties<Unknown, typeof Unknown>;

/**
 * Interface that defines for each scene its component class and type of that class.
 */
interface SceneProperties<
  TClass extends Scene<SceneNames>,
  TTypeof extends typeof Scene
> {
  /**
   * Scene component class type.
   */
  class: TClass;

  /**
   * Scene component class type type.
   */
  typeof: TTypeof;
}

/**
 * Union of all scene names.
 */
export type SceneNames = ScenesProperties["class"] extends Scene<
  infer InferredSceneName
>
  ? InferredSceneName
  : never;

/**
 * Type that maps scene name to its class type.
 */
type SceneClassTypes = {
  [SceneName in SceneNames]: ScenesProperties extends infer InferredSceneType
    ? InferredSceneType extends SceneProperties<
        infer InferredSceneClass,
        infer InferredSceneType
      >
      ? InferredSceneClass extends Scene<infer InferredSceneName>
        ? SceneName extends InferredSceneName
          ? InferredSceneType
          : never
        : never
      : never
    : never
};

/**
 * Object where scene names are mapped to its class type. This object is used to
 * render a scene using only its name and change drawn scene by only changing
 * the name of the current scene in store `ScenesStore`.
 */
export const SCENES: Readonly<SceneClassTypes> = {
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
interface RoutableStageProperties {
  "/administration": StageProperties<"administration", never>;
  "/diet": StageProperties<"diet", never>;
  "/history": StageProperties<"history", never>;
  "/": StageProperties<"home", never>;
  "/login": StageProperties<"login", never>;
  "/logout": StageProperties<"logout", never>;
  "/measurements": StageProperties<"measurements", never>;
  "/register/{invitationId}": StageProperties<"register", "invitationId">;
  "/settings": StageProperties<"settings", never>;
}

/**
 * Union of all routes.
 */
type Routes = keyof RoutableStageProperties;

/**
 * Union of all stage definitions that cannot be accessed by navigating to a
 * specific URL.
 */
type DeepStageProperties = StageProperties<"unknown", never>;

/**
 * Type that is a union of all possible parameter names to `string` mappings of
 * all routes, which scene name is one of the `TSceneNames` names.
 */
export type SceneParameters<TSceneNames extends string> =
  | RoutableStageProperties[Routes]
  | DeepStageProperties extends infer InferredTypes
  ? InferredTypes extends StageProperties<
      infer InferredSceneName,
      infer InferredParameterNames
    >
    ? InferredSceneName extends TSceneNames
      ? { [ParameterName in InferredParameterNames]: string }
      : never
    : never
  : never;

/**
 * Type that defines some route's scene name and route parameter names.
 */
interface StageProperties<
  TSceneName extends string,
  TParameterNames extends string
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
 * Object that maps all routes to their corresponding scene name. Used to
 * retrieve scene name based on current browser pathname.
 */
export const ROUTES: Readonly<
  { [Route in Routes]: RoutableStageProperties[Route]["sceneName"] }
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
      sceneName: ROUTES[route as Routes],
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
    if (ROUTES[route as Routes] !== sceneName) {
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
