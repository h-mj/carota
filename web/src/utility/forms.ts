import { Error } from "api";
import { InputErrorReasons, InputValuesX } from "../component/Form";
import { InputNames } from "../component/Input";

/**
 * Checks whether or not `inputName` is a input name using `inputValues` object,
 * which should contain `inputName` as it's key.
 *
 * @param inputName Field name.
 * @param inputValues Input values which are used to check whether or not
 * `inputName` is a form field.
 */
export const isInputName = <TInputNames extends InputNames>(
  inputName: string,
  inputValues: Readonly<InputValuesX<TInputNames>>
): inputName is TInputNames => {
  return inputName in inputValues;
};

/**
 * Creates `InputValues<TInputNames>` object with all empty values from a given
 * array of input names.
 *
 * @param inputName Array of all form input names.
 */
export const createInputValues = <TInputNames extends InputNames>(
  inputNames: Readonly<Array<TInputNames>>
): InputValuesX<TInputNames> => {
  const values: { [name: string]: string } = {};

  for (const inputName of inputNames) {
    values[inputName] = "";
  }

  return values as InputValuesX<TInputNames>;
};

/**
 * Creates a new `InputErrorReasons<TInputNames>` object from given API `Error`
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
  error: Error | undefined,
  values: Readonly<InputValuesX<TInputNames>>
): InputErrorReasons<TInputNames> => {
  const errors: InputErrorReasons<TInputNames> = {};

  if (error === undefined || error.details === undefined) {
    return errors;
  }

  for (const detail of error.details) {
    const { field } = detail.location;

    if (field === undefined || !isInputName(field, values)) {
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
  reasons: Readonly<InputErrorReasons<TInputNames>>
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
