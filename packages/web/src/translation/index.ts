import { TranslatedComponentTranslations } from "../base/TranslatedComponent";

/**
 * Translation object type that contains all translated strings.
 */
export interface Translation {
  /**
   * Translated component translations.
   */
  components: TranslatedComponentTranslations;

  /**
   * Language locale string.
   */
  locale: string;

  /**
   * Time locale definition.
   */
  timeLocale: d3.TimeLocaleDefinition;

  /**
   * Unit translations.
   */
  units: Record<"cm" | "g" | "kcal" | "kg" | "ml" | "pcs", string>;

  /**
   * Notification message on unknown error.
   */
  unknownError: string;
}
