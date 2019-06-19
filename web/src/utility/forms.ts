import { Error } from "api";
import { FormErrorReasons, FormValues } from "../component/Form";
import { InputName } from "../component/Input";

/**
 * Checks whether or not `field` is a form input name.
 *
 * @param field
 * @param object
 */
export const isFormInputName = <TNames extends InputName>(
  field: string,
  object: FormValues<TNames>
): field is TNames => {
  return field in object;
};

/**
 * Creates a new `FormErrorReasons<TName>` object from given API `Error` object
 * detailing for each erroneous field its error reason.
 *
 * Form `values` object is used to check whether or not erroneous field is form
 * field or not.
 *
 * @param error API Error object.
 * @param values Form values used to check whether or not field is a form field.
 */
export const createFormErrorsReasons = <TNames extends InputName>(
  error: Error,
  values: FormValues<TNames>
): FormErrorReasons<TNames> => {
  const errors: FormErrorReasons<TNames> = {};

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
export const anyErrors = <TNames extends InputName>(
  reasons: FormErrorReasons<TNames>
) => {
  return Object.keys(reasons).length !== 0;
};
