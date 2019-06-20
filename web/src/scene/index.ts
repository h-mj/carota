import { Scene } from "./Scene";
import { Home } from "./Home";
import { SignIn } from "./SignIn";
import { Unknown } from "./Unknown";

/**
 * Union of all scene types.
 */
type SceneTypes =
  | SceneType<Home, typeof Home>
  | SceneType<SignIn, typeof SignIn>
  | SceneType<Unknown, typeof Unknown>;

/**
 * Interface that defines for each scene its component class and type of that class.
 */
interface SceneType<
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
export type SceneNames = SceneTypes["class"] extends Scene<
  infer InferredSceneName
>
  ? InferredSceneName
  : never;

/**
 * Object where scene names are mapped to its class type. This object is used to
 * render a scene using only its name and change drawn scene by only changing
 * the name of the current scene in store `ScenesStore`.
 */
export const SCENES: { readonly [SceneName in SceneNames]: typeof Scene } = {
  home: Home,
  signIn: SignIn,
  unknown: Unknown
};

/**
 * Stage type that defines a scene name and its parameters.
 */
export interface Stage<TSceneName extends SceneNames> {
  /**
   * Stage's scene name.
   */
  sceneName: TSceneName;

  /**
   * Stage's context.
   */
  parameters: Parameters<TSceneName>;
}

/**
 * Defines routes and its corresponding scene name and route parameter names. If
 * route parameter names type is `never`, then there are no parameters within
 * the path.
 */
interface RouteTypes {
  "/": RouteType<"home", never>;
  "/login": RouteType<"signIn", never>;
}

/**
 * Type that defines some route's scene name and route parameter names.
 */
interface RouteType<
  TSceneName extends SceneNames,
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
 * Type that is a union of all possible parameter names to `string` mappings of
 * all routes, which scene name is one of the `TSceneNames` names.
 */
export type Parameters<TSceneNames extends string> = {
  [SceneName in TSceneNames]: {
    [Route in keyof RouteTypes]: RouteTypes[Route]["sceneName"] extends SceneName
      ? { [ParameterName in RouteTypes[Route]["parameterNames"]]: string }
      : never
  }[keyof RouteTypes]
}[TSceneNames];

/**
 * Object that maps all routes to their corresponding scene name. Used to
 * retrieve scene name based on current browser pathname.
 */
export const ROUTES: {
  readonly [Route in keyof RouteTypes]: RouteTypes[Route]["sceneName"]
} = {
  "/": "home",
  "/login": "signIn"
};
