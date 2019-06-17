import { ValidationError } from "@hapi/joi";
import { BadRequestError } from "../../error/BadRequestError";
import { UnauthorizedError } from "../../error/UnauthorizedError";
import { ErrorDetail } from "../../types";

/**
 * Function that is used as `onerror` function in `koa-bodyparser`.
 *
 * Throws a `BadRequestError` when `koa-bodyparser` fails to parse the body.
 */
export const bodyParserOnError = () => {
  const message = "Invalid JSON object in the request body message.";

  throw new BadRequestError(message, {
    location: {
      part: "body"
    },
    reason: "invalid",
    message
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createValidationError = (_: ValidationError) => {
  return new BadRequestError();
};

/**
 * Creates a new `UnauthorizedError` based on invalid fields.
 *
 * @param fields One or more invalid fields.
 */
export const createInvalidCredentialsError = (...fields: string[]) => {
  const message = `Invalid ${fields
    .join(", ")
    .replace(/, ([^,]*)$/, " or $1")}.`;

  return new UnauthorizedError(
    message,
    ...fields.map(
      (field): ErrorDetail => ({
        location: {
          part: "body",
          field
        },
        reason: "invalid",
        message
      })
    )
  );
};

/**
 * Creates a new `BadRequestError` because of nonexistent ID.
 *
 * @param field Field which contained nonexistent ID.
 */
export const createIdNotFoundError = (
  id: string,
  entity: string,
  field: string
) => {
  const message = `${entity} with ID "${id}" does not exist.`;

  return new BadRequestError(message, {
    location: {
      part: "body",
      field
    },
    reason: "notFound",
    message
  });
};

/**
 * Creates a new `BadRequestError` stating that given field is not unique.
 *
 * @param field Field, whose value must be unique.
 */
export const createUniqueConstraintError = (field: string) => {
  const message = `Field "${field}" must be unique.`;

  return new BadRequestError(message, {
    location: {
      part: "body",
      field
    },
    reason: "notUnique",
    message
  });
};
