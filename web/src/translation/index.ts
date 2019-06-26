import { ErrorReasons } from "api";
import { SceneNames } from "../scene/Scene";
import { ErrorNames } from "../component/Error";
import { FormNames } from "../component/Form";
import {
  InputNames,
  SwitchInputNames,
  SwitchInputOptions
} from "../component/Input";
import { NotificationNames } from "../component/NotificationContainer";

/**
 * Translation type that contains all other translations.
 */
export interface Translation {
  /**
   * Error component translations.
   */
  errors: ErrorsTranslation;

  /**
   * Input component translations.
   */
  inputs: InputsTranslation;

  /**
   * Form component translations.
   */
  forms: FormsTranslation;

  /**
   * Notification component translations.
   */
  notifications: NotificationsTranslation;

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
 * Type that maps notification names to their translations.
 */
type NotificationsTranslation = {
  [NotificationName in NotificationNames]: NotificationTranslation
};

/**
 * Translations of an notification component.
 */
interface NotificationTranslation {
  message: string;
}

/**
 * Type that maps error names to their translations.
 */
type ErrorsTranslation = { [ErrorName in ErrorNames]: ErrorTranslation };

/**
 * Translations of an error component.
 */
interface ErrorTranslation {
  title: string;
  message: string;
}

/**
 * Type that maps input names to their translations.
 */
type InputsTranslation = {
  [InputName in InputNames]: InputName extends SwitchInputNames
    ? SwitchInputTranslation<SwitchInputOptions[InputName]>
    : InputTranslation
};

/**
 * Translations of an input component.
 */
interface InputTranslation {
  /**
   * Input name.
   */
  name: string;

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
 * Translations of an switch input that includes translations of all its
 * options.
 */
interface SwitchInputTranslation<TOptions extends string>
  extends InputTranslation {
  /**
   * Switch option translations.
   */
  options: SwitchInputOptionsTranslations<TOptions>;
}

/**
 * Type that maps options to their translations.
 */
type SwitchInputOptionsTranslations<TOptions extends string> = {
  [Option in TOptions]: string
};

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
