import { computed } from "mobx";
import { RouteParameters, SCENES, ScenePosition } from "./SceneContext";
import { ClassTranslation, Component } from "../component/Component";

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
 * Union of `TProps` types of scene components with name one of `TSceneNames`.
 */
export type SceneProps<
  TSceneNames extends SceneNames
> = typeof SCENES[TSceneNames] extends new (...args: any) => infer IClass
  ? IClass extends Scene<infer _, infer IProps>
    ? IProps
    : never
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
 * Type that maps scene names to their component class types.
 */
type SceneMap = {
  [SceneName in SceneNames]: typeof SCENES[SceneName] extends new (
    ...args: any
  ) => infer IComponent
    ? IComponent
    : never
};

/**
 * Maps component class name to its translation type.
 */
export type ScenesTranslation = ClassTranslation<SceneNames, SceneMap>;

/**
 * Scene component base class that is extended by all scene components.
 *
 * Generic parameter `TSceneName` is used to reference a scene by their name in
 * other parts of the application.
 */
export abstract class Scene<
  TSceneName extends SceneNames,
  TProps extends {} = {},
  TTranslation extends {} = {}
> extends Component<TProps & DefaultSceneProps<TSceneName>, TTranslation> {
  /**
   * Returns translation object of this scene.
   */
  @computed
  public get translation(): TTranslation {
    return (this.props.views!.translation.scenes[
      this.constructor.name as SceneNames
    ] as unknown) as TTranslation;
  }

  /**
   * Included so that TypeScript's infer would work, since it uses object
   * structure to determine types.
   */
  // @ts-ignore
  private propsType?: TProps;
}
