import { RouteParameters, SCENES, ScenePosition } from "./SceneContext";
import { Component } from "../component/Component";

/**
 * Union of scene names, used to reference a specific scene using its name.
 */
export type SceneNames = keyof typeof SCENES;

/**
 * Default scene component props type.
 */
export interface DefaultSceneProps<TSceneName extends SceneNames> {
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
export type SceneMap = {
  [SceneName in SceneNames]: typeof SCENES[SceneName] extends new (
    ...args: infer _
  ) => infer IClass
    ? IClass
    : never
};

/**
 * Props object type of scenes named `TSceneNames`.
 */
export type SceneProps<
  TSceneNames extends SceneNames
> = SceneMap[TSceneNames] extends Scene<infer _1, infer IProps, infer _2>
  ? IProps
  : never;

/**
 * Default scene component translation type.
 */
export interface DefaultSceneTranslation {
  /**
   * Title of this scene, which will be used as `window.title` when this scene
   * is shown.
   */
  title: string;
}

/**
 * Scene component base class that is extended by all scene components.
 *
 * Generic parameter `TSceneName` is used to reference a scene by their name in
 * other parts of the application.
 */
export abstract class Scene<
  TName extends SceneNames,
  TProps extends {} = {},
  TTranslation extends {} | undefined = undefined
> extends Component<TName, TProps & DefaultSceneProps<TName>, TTranslation> {
  /**
   * Included so that TypeScript's infer would work, since it uses object
   * structure to determine types.
   */
  // @ts-ignore
  private propsType?: TProps;
}
