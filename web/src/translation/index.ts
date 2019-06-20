import { InputNames } from "../component/Input";
import { ErrorReasons } from "api";
import { FormTypes } from "../component/Form";

/**
 * Translation type that contains all other translations.
 */
export interface Translation {
  /**
   * Input component translations.
   */
  readonly inputs: InputTranslations;

  /**
   * Form component translations.
   */
  readonly forms: FormTranslations;
}

/**
 * Type that maps input name to its translation.
 */
type InputTranslations = {
  readonly [InputName in InputNames]: InputTranslation
};

/**
 * Translations of an input component.
 */
interface InputTranslation {
  /**
   * Input placeholder text.
   */
  readonly placeholder: string;

  /**
   * Error reason translations.
   */
  readonly reasons: InputErrorReasonTranslations;
}

/**
 * Error reason translation texts.
 */
type InputErrorReasonTranslations = {
  readonly [ErrorReason in ErrorReasons]?: string
};

/**
 * Type that maps form scene name to its translation.
 */
type FormTranslations = { readonly [FormType in FormTypes]: FormTranslation };

/**
 * Translations of a form component.
 */
interface FormTranslation {
  /**
   * Form submit button text.
   */
  readonly submit: string;

  /**
   * Form title text that will be shown before input fields.
   */
  readonly title?: string;
}
