import { Error } from "api";
import { InputNames } from "../component/Input";
import { FormErrorReasons, FormValues } from "../component/Form";

/**
 * Checks whether or not `inputName` is a form input name using `formValues`
 * object, which should contain `inputName` as it's key.
 *
 * @param inputName Field name.
 * @param formValues Form values which are used to check whether or not
 * `inputName` is a form field.
 */
export const isFormInputName = <TInputNames extends InputNames>(
  inputName: string,
  formValues: FormValues<TInputNames>
): inputName is TInputNames => {
  return inputName in formValues;
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
export const createFormErrorsReasons = <TInputNames extends InputNames>(
  error: Error,
  values: FormValues<TInputNames>
): FormErrorReasons<TInputNames> => {
  const errors: FormErrorReasons<TInputNames> = {};

  if (error.details === undefined) {
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
export const anyErrors = <TInputNames extends InputNames>(
  reasons: FormErrorReasons<TInputNames>
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
