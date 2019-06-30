import { SceneNames } from "../scene/Scene";
import { FormNames } from "../component/Form";
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
   * Form component translations.
   */
  forms: FormsTranslation;

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
 * Type that maps form names to their translations.
 */
type FormsTranslation = { [FormType in FormNames]: FormTranslation };

/**
 * Translations of a form component.
 */
interface FormTranslation {
  /**
   * Form submit button text.
   */
  submit: string;

  /**
   * Form title text that will be shown before input fields.
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
