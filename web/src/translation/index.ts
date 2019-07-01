import { SceneNames } from "../scene/Scene";
import { ComponentsTranslation } from "../component/Component";

/**
 * Translation type that contains all other translations.
 */
export interface Translation {
  /**
   * Translation of components.
   */
  components: ComponentsTranslation;

  /**
   * Scene component translations.
   */
  scenes: ScenesTranslation;

  /**
   * Application name.
   */
  title: string;
}

/**
 * Type that maps scene names to their translations.
 */
type ScenesTranslation = { [SceneName in SceneNames]: SceneTranslation };

/**
 * Translations of a scene component.
 */
interface SceneTranslation {
  /**
   * Title of this scene, which will be used as `window.title` when this scene
   * is shown.
   */
  title: string;
}
