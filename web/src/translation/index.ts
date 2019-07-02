import { SceneNames, SceneTranslation } from "../scene/Scene";
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
  scenes: Record<SceneNames, SceneTranslation>;

  /**
   * Application name.
   */
  title: string;
}
