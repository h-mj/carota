import { ErrorReasons } from "api";
import { InputNames } from "../component/Input";
import { FormNames } from "../component/Form";
import { SceneNames } from "../scene";
import { AlertNames } from "../component/Alerts";

/**
 * Translation type that contains all other translations.
 */
export interface Translation {
  /**
   * Alert component translations.
   */
  alerts: AlertsTranslation;

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
 * Type that maps alert names to their translations.
 */
type AlertsTranslation = { [AlertName in AlertNames]: AlertTranslation };

/**
 * Translations of an alert component.
 */
interface AlertTranslation {
  message: string;
}

/**
 * Type that maps input names to their translations.
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
 * Type that maps error reasons to their translations.
 */
type InputErrorReasonTranslations = { [ErrorReason in ErrorReasons]?: string };

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
  title?: string;
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
