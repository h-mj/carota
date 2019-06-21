import { ErrorReasons } from "api";
import { InputNames } from "../component/Input";
import { FormTypes } from "../component/Form";
import { SceneNames } from "../scene";

/**
 * Translation type that contains all other translations.
 */
export interface Translation {
  /**
   * Input component translations.
   */
  inputs: InputsTranslation;

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
 * Type that maps input name to its translation.
 */
type InputsTranslation = { [InputName in InputNames]: InputTranslation };

/**
 * Translations of an input component.
 */
interface InputTranslation {
  /**
   * Input placeholder text.
   */
  placeholder: string;

  /**
   * Error reason translations.
   */
  reasons: InputErrorReasonTranslations;
}

/**
 * Error reason translation texts.
 */
type InputErrorReasonTranslations = { [ErrorReason in ErrorReasons]?: string };

/**
 * Type that maps form scene name to its translation.
 */
type FormsTranslation = { [FormType in FormTypes]: FormTranslation };

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
  title?: string;
}

/**
 * Type that maps scene name to its translation.
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
