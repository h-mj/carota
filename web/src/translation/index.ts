import { InputNames } from "../component/Input";
import { ErrorReasons } from "api";
import { FormSceneNames } from "../component/Form";

/**
 * Translation type that includes all other translations.
 */
export interface Translation {
  /**
   * Input component translations.
   */
  inputs: InputTranslations;

  /**
   * Form component translations.
   */
  forms: FormTranslations;
}

/**
 * Type that maps input name to its translation.
 */
type InputTranslations = { [InputName in InputNames]: InputTranslation };

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
type FormTranslations = { [FormSceneName in FormSceneNames]: FormTranslation };

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
