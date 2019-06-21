import { Scene } from "./Scene";
import { Home } from "./Home";
import { Register } from "./Register";
import { SignIn } from "./SignIn";
import { Unknown } from "./Unknown";

/**
 * Union of all scene types.
 */
type ScenesProperties =
  | SceneProperties<Home, typeof Home>
  | SceneProperties<Register, typeof Register>
  | SceneProperties<SignIn, typeof SignIn>
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
  home: Home,
  register: Register,
  signIn: SignIn,
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
  "/": StageProperties<"home", never>;
  "/login": StageProperties<"signIn", never>;
  "/register/{invitationId}": StageProperties<"register", "invitationId">;
}

/**
 * Union of all stage definitions that cannot be accessed by navigating to a
 * specific URL.
 */
type DeepStageProperties = StageProperties<"unknown", never>;

/**
 * Type that is a union of all possible parameter names to `string` mappings of
 * all routes, which scene name is one of the `TSceneNames` names.
 */
export type Parameters<TSceneNames extends string> =
  | RoutableStageProperties[keyof RoutableStageProperties]
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
  {
    [Route in keyof RoutableStageProperties]: RoutableStageProperties[Route]["sceneName"]
  }
> = {
  "/": "home",
  "/login": "signIn",
  "/register/{invitationId}": "register"
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
 * Scene names that do not require authentication.
 */
export const NO_AUTHENTICATION_SCENE_NAMES: Readonly<SceneNames[]> = [
  "register",
  "signIn"
];

/**
 * Stage that is shown if user is not authenticated but tries to access a stage
 * that requires authentication.
 */
export const GATEWAY_STAGE: Readonly<Stage<"signIn">> = {
  sceneName: "signIn",
  parameters: {}
};

/**
 * Stage that is shown if no other stages match current URL.
 */
export const UNKNOWN_STAGE: Readonly<Stage<"unknown">> = {
  sceneName: "unknown",
  parameters: {}
};
