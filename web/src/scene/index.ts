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
 * Interface that defines scene component class and type.
 */
interface SceneType<
  TClass extends Scene<SceneNames>,
  TTypeof extends typeof Scene
> {
  /**
   * Scene class type.
   */
  class: TClass;

  /**
   * Scene typeof type.
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
 * Type which maps scene name to its class type.
 */
type SceneClasses = { [SceneName in SceneNames]: typeof Scene };

/**
 * Object where scene names are mapped to its class. This object is used to
 * render a scene using only its name and change drawn scene by only changing
 * the name of the current scene.
 */
export const SCENES: SceneClasses = {
  home: Home,
  signIn: SignIn,
  unknown: Unknown
};

/**
 * Stage type that defines it's scene and context.
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
 * Maps routes to corresponding scene and route parameters.
 */
interface RouteTypes {
  "/": RouteType<"home">;
  "/login": RouteType<"signIn">;
}

/**
 * Type that defines route scene name and route parameters.
 */
interface RouteType<
  TSceneName extends SceneNames,
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
 * Parameters object type of scene named `TSceneName`, which maps scene's route
 * parameters `ParameterNames<TSceneName>` to `string`, if it is required in
 * each parameter list, or `string | undefined`.
 */
export type Parameters<TSceneNames extends string> = {
  [SceneName in TSceneNames]: {
    [Route in keyof RouteTypes]: RouteTypes[Route]["sceneName"] extends SceneName
      ? { [ParameterName in RouteTypes[Route]["parameterNames"]]: string }
      : never
  }[keyof RouteTypes]
}[TSceneNames];

/**
 * Type that maps route to its scene name.
 */
type RouteSceneNames = {
  [Route in keyof RouteTypes]: RouteTypes[Route]["sceneName"]
};

/**
 * The object that stores the mapping between routes and scenes.
 */
export const ROUTES: RouteSceneNames = {
  "/": "home",
  "/login": "signIn"
};
