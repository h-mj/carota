import { RouteParameters, SCENE_COMPONENTS, ScenePosition } from "./Scene";
import { TranslatedComponent } from "./TranslatedComponent";

/**
 * Union of scene names, used to reference a specific scene using its name.
 */
export type SceneNames = keyof typeof SCENE_COMPONENTS;

/**
 * Default scene component props type.
 */
export interface DefaultSceneComponentProps<TSceneName extends SceneNames> {
  /**
   * Parameters of this scene.
   */
  parameters: RouteParameters<TSceneName>;

  /**
   * Position where the scene will be rendered to.
   */
  position: ScenePosition;
}

/**
 * Type that maps scene names to their component class types.
 */
export type SceneComponentMap = {
  [SceneName in SceneNames]: typeof SCENE_COMPONENTS[SceneName] extends new (
    ...args: infer _
  ) => infer IClass
    ? IClass
    : never
};

/**
 * Props types of scene components of scenes named `TSceneNames`.
 */
export type SceneComponentProps<
  TSceneNames extends SceneNames
> = SceneComponentMap[TSceneNames] extends SceneComponent<
  infer _1,
  infer IProps,
  infer _2
>
  ? IProps
  : never;

/**
 * Scene component base class that is extended by all scene components.
 *
 * Generic parameter `TSceneName` is used to reference a scene by their name in
 * other parts of the application.
 */
export abstract class SceneComponent<
  TName extends SceneNames,
  TProps extends {} = {},
  TTranslation extends {} | undefined = undefined
> extends TranslatedComponent<
  TName,
  TProps & DefaultSceneComponentProps<TName>,
  TTranslation
> {
  /**
   * Included so that TypeScript's infer would work, since it uses object
   * structure to determine types.
   */
  // @ts-ignore
  private propsType?: TProps;
}
