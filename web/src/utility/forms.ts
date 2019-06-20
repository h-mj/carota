import { Error } from "api";
import { InputNames } from "../component/Input";
import { FormErrorReasons, FormValues } from "../component/Form";

/**
 * Checks whether or not `field` is a form input name.
 *
 * @param field
 * @param object
 */
export const isFormInputName = <TInputNames extends InputNames>(
  field: string,
  object: FormValues<TInputNames>
): field is TInputNames => {
  return field in object;
};

/**
 * Creates a new `FormErrorReasons<TInputNames>` object from given API `Error`
 * object detailing for each erroneous field its error reason.
 *
 * Form `values` object is used to check whether or not erroneous field is form
 * field or not.
 *
 * @param error API Error object.
 * @param values Form values used to check whether or not field is a form field.
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
 * Returns whether or not there are any erroneous fields.
 *
 * @param reasons Error reasons of each field.
 */
export const anyErrors = <TInputNames extends InputNames>(
  reasons: FormErrorReasons<TInputNames>
) => {
  return Object.keys(reasons).length !== 0;
};
