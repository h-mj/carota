import {
  ErrorContext,
  ErrorContextElement,
  ErrorDetail,
  ErrorReasons
} from "../../../types";
import { ValidationError } from "@hapi/joi";
import { BadRequestError } from "../../error/BadRequestError";
import { InternalServerErrorError } from "../../error/InternalServerError";
import { UnauthorizedError } from "../../error/UnauthorizedError";

/**
 * Function that is used as `onerror` function in `bodyParser` options.
 *
 * @throws `BadRequestError` if `bodyParser` fails to parse the body.
 */
export const bodyParserOnError = (): never => {
  const message = "Invalid JSON object in the request body message.";

  throw new BadRequestError(message, {
    location: {
      part: "body"
    },
    reason: "invalid",
    message
  });
};

/**
 * Maps Joi error types to error reasons.
 */
const TYPE_TO_REASON: Readonly<{ [type: string]: ErrorReasons }> = {
  "any.allowOnly": "invalid",
  "any.empty": "empty",
  "any.required": "missing",
  "number.base": "invalid",
  "object.allowUnknown": "unexpected",
  "object.base": "invalid",
  "string.email": "invalid",
  "string.guid": "invalid",
  "string.min": "invalid",
  "string.regex.base": "invalid"
};

/**
 * Defines for each error type which fields will appear in error context under
 * which name and defines optional `stringify` and `transform` functions.
 * `undefined` if context must not be included.
 */
const TYPE_TO_CONTEXT_TEMPLATE: Readonly<{
  [type: string]: { [field: string]: Transformation };
}> = {
  "any.allowOnly": { valids: { name: "options" } },
  "string.min": { limit: { name: "length" } }
};

/**
 * Type that contains a new name and optional stringify and transformation
 * functions for a specific field in Joi detail context.
 */
interface Transformation {
  /**
   * New name of the field.
   */
  name: string;

  /**
   * Function that converts field value into a string for error messages.
   */
  stringify?: Stringify;

  /**
   * Function that converts field value into another value of some kind.
   */
  transform?: Transform;
}

/**
 * Function type that transforms a `ContextElement` object into a string.
 */
interface Stringify {
  (entity: ErrorContextElement): string;
}

/**
 * Transformation function type that transforms an unknown object into a
 * `ContextElement`.
 */
interface Transform {
  (entity: unknown): ErrorContextElement;
}

/**
 * Default `stringify` function that is used if no `stringify` function is
 * provided.
 *
 * @param entity Entity that is being transformed.
 */
const DEFAULT_STRINGIFY: Stringify = (entity: ErrorContextElement) => {
  if (Array.isArray(entity)) {
    return `[${entity.map(DEFAULT_STRINGIFY).join(", ")}]`;
  }

  return `${entity}`;
};

/**
 * Default transformation function that is used if no transform function is
 * provided.
 *
 * @param entity Entity that is being transformed.
 */
const DEFAULT_TRANSFORM: Transform = (entity: unknown) => {
  if (Array.isArray(entity)) {
    return entity;
  }

  if (typeof entity === "number") {
    return entity;
  }

  return `${entity}`;
};

/**
 * Maps Joi error types to message templates.
 *
 * Substring `{field}` will be replaced by corresponding field name and other
 * variables (in the form of `{VARIABLE}`) will be replaced by stringified
 * versions of the values using defined `stringify` function provided by
 * `Transformation` object, or `DEFAULT_STRINGIFY` function. Other variable
 * names must appear in this type's `Transformation` object as `name` field.
 */
const TYPE_TO_MESSAGE: Readonly<{ [type: string]: string }> = {
  "any.allowOnly": 'Field "{field}" must be one of {options}.',
  "any.empty": 'Field "{field}" must not be empty.',
  "any.required": 'Field "{field}" is required.',
  "number.base": 'Field "{field} must be a valid number.',
  "object.allowUnknown": 'Field "{field}" was not expected.',
  "object.base": 'Field "{field}" must be a valid object.',
  "string.email": 'Field "{field}" must be a valid email.',
  "string.guid": 'Field "{field}" must be a valid GUID.',
  "string.min": 'Field "{field}" must be at least {length} characters long.',
  "string.regex.base": 'Field "{field}" does not match required pattern.'
};

/**
 * Creates a new `BadRequestError` from `Joi.ValidationError`.
 *
 * @param error Given `ValidationError`.
 */
export const createValidationError = (
  error: ValidationError
): BadRequestError => {
  const details: ErrorDetail[] = [];

  for (const detail of error.details) {
    const type = detail.type;

    if (!(type in TYPE_TO_REASON)) {
      throw new InternalServerErrorError(
        `Error type "${type}" has no matching reason.`
      );
    }

    const path = detail.path;
    const field = path[path.length - 1];

    if (field === undefined) {
      continue;
    }

    const template = TYPE_TO_CONTEXT_TEMPLATE[type];

    let message = TYPE_TO_MESSAGE[type].replace("{field}", field);
    const context: ErrorContext | undefined =
      template !== undefined ? {} : undefined;

    if (
      detail.context !== undefined &&
      template !== undefined &&
      context !== undefined
    ) {
      for (const key in template) {
        const { name, stringify, transform } = template[key];
        const value = (transform || DEFAULT_TRANSFORM)(detail.context[key]);

        message = message.replace(
          `{${name}}`,
          (stringify || DEFAULT_STRINGIFY)(value)
        );
        context[template[key].name] = value;
      }
    }

    details.push({
      location: { part: "body", path },
      reason: TYPE_TO_REASON[type],
      context,
      message
    });
  }

  return new BadRequestError(
    "One or more fields failed validation.",
    ...details
  );
};

/**
 * Creates a new `UnauthorizedError` based on invalid fields.
 *
 * @param fields One or more invalid fields.
 */
export const createInvalidCredentialsError = (
  ...paths: string[][]
): UnauthorizedError => {
  const message = `Incorrect ${paths
    .map(path => path[path.length - 1])
    .join(", ")
    .replace(/, ([^,]*)$/, " or $1")}.`;

  return new UnauthorizedError(
    message,
    ...paths.map(
      (path): ErrorDetail => ({
        location: { part: "body", path },
        reason: "incorrect",
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
  path: string[]
): BadRequestError => {
  const message = `${entity} with ID "${id}" does not exist.`;

  return new BadRequestError(message, {
    location: { part: "body", path },
    reason: "incorrect",
    message
  });
};

/**
 * Creates a new `BadRequestError` stating that given field is not unique.
 *
 * @param field Field, which value must be unique.
 */
export const createUniqueConstraintError = (
  path: string[]
): BadRequestError => {
  const message = `Field "${path[path.length - 1]}" must be unique.`;

  return new BadRequestError(message, {
    location: { part: "body", path },
    reason: "conflict",
    message
  });
};
