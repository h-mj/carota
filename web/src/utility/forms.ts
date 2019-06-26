import { Error } from "api";
import {
  FormErrorReasons,
  FormInputNames,
  FormNames,
  FormValues
} from "../component/Form";

/**
 * Checks whether or not `inputName` is a form input name using `formValues`
 * object, which should contain `inputName` as it's key.
 *
 * @param inputName Field name.
 * @param formValues Form values which are used to check whether or not
 * `inputName` is a form field.
 */
export const isFormInputName = <TFormName extends FormNames>(
  inputName: string,
  formValues: FormValues<TFormName>
): inputName is FormInputNames[TFormName] => {
  return inputName in formValues;
};

/**
 * Creates `FormValues<TFormName>` object with all empty values from a given array of input names.
 *
 * @param inputName Array of all form input names.
 */
export const createFormValues = <TFormName extends FormNames>(
  inputNames: Array<FormInputNames[TFormName]>
): FormValues<TFormName> => {
  const values: { [name: string]: string } = {};

  for (const inputName of inputNames) {
    values[inputName] = "";
  }

  return values as FormValues<TFormName>;
};

/**
 * Creates a new `FormErrorReasons<TInputNames>` object from given API `Error`
 * object detailing for each erroneous field its error reason.
 *
 * Form `values` object is used to check whether or not erroneous input field is
 * form input field or not.
 *
 * @param error API Error object.
 * @param values Form values which are used to check whether or not field is a
 * form field.
 */
export const createFormErrorsReasons = <TFormName extends FormNames>(
  error: Error | undefined,
  values: FormValues<TFormName>
): FormErrorReasons<TFormName> => {
  const errors: FormErrorReasons<TFormName> = {};

  if (error === undefined || error.details === undefined) {
    return errors;
  }

  for (const detail of error.details) {
    const { field } = detail.location;

    if (field === undefined || !isFormInputName(field, values)) {
      continue;
    }

    errors[field] = detail.reason;
  }

  return errors;
};

/**
 * Returns whether or not there are any erroneous input fields.
 *
 * @param reasons Error reasons object.
 */
export const anyErrors = <TFormName extends FormNames>(
  reasons: FormErrorReasons<TFormName>
) => {
  return Object.keys(reasons).length !== 0;
};

/**
 * Returns a promise that is resolved in `timeout` seconds.
 *
 * @param timeout Timeout in seconds.
 */
export const setTimeout = (timeout: number) => {
  return new Promise(resolve => window.setTimeout(resolve, timeout * 1000));
};
