import { ComponentsTranslation } from "../base/TranslatedComponent";

/**
 * Translation object type that contains all translated strings.
 */
export interface Translation {
  /**
   * Translated component translations.
   */
  components: ComponentsTranslation;

  /**
   * Unit translations.
   */
  units: Record<"g" | "kcal" | "ml" | "pcs", string>;
}
