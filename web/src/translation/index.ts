import { InputName } from "../component/Input";
import { FormScene } from "../scene";

/**
 * Translation type that includes all other translations.
 */
export interface Translation {
  inputs: InputTranslations;
  forms: FormTranslations;
}

/**
 * Type that maps input name to its translation.
 */
type InputTranslations = { [I in InputName]: InputTranslation };

/**
 * Translations of an input component.
 */
interface InputTranslation {
  placeholder: string;
}

/**
 * Type that maps form scene name to its translation.
 */
type FormTranslations = { [S in FormScene]: FormTranslation };

/**
 * Translations of a form component.
 */
interface FormTranslation {
  submit: string;
}
