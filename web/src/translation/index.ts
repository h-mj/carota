import { Languages } from "api";
import { ScenesTranslation } from "../scene/Scene";
import { ComponentsTranslation } from "../component/Component";
import { english } from "./english";
import { estonian } from "./estonian";
import { russian } from "./russian";

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
 * Object that stores each language's translation object.
 */
export const TRANSLATIONS: Readonly<
  { [Language in Languages]: Translation }
> = {
  English: english,
  Estonian: estonian,
  Russian: russian
};
