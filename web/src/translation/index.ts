import { ScenesTranslation } from "../scene/Scene";
import { ComponentsTranslation } from "../component/Component";

/**
 * Translation object type that contains all translated strings.
 */
export interface Translation {
  /**
   * Component translations.
   */
  components: ComponentsTranslation;

  /**
   * Scene translations.
   */
  scenes: ScenesTranslation;
}
