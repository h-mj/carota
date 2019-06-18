import { ValidationError } from "@hapi/joi";
import { BadRequestError } from "../../error/BadRequestError";
import { UnauthorizedError } from "../../error/UnauthorizedError";
import {
  ErrorDetail,
  ErrorReason,
  ErrorContext,
  ContextElement
} from "../../types";
import { InternalServerErrorError } from "../../error/InternalServerError";

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

/**
 * Maps Joi error types to reasons. Most of the time type and reason have
 * opposite meanings.
 */
const TYPE_TO_REASON: { [type: string]: ErrorReason } = {
  "any.allowOnly": "invalid",
  "any.empty": "empty",
  "any.required": "missing",
  "object.allowUnknown": "unexpected",
  "string.email": "invalid",
  "string.guid": "invalid",
  "string.min": "invalid"
};

/**
 * Enumerates for each error type which fields will appear under which name in
 * error context. `undefined` if context must not be included.
 */
const TYPE_TO_CONTEXT_TEMPLATE: {
  [type: string]: { [field: string]: Transform };
} = {
  "any.allowOnly": { valids: { name: "options" } },
  "string.min": { limit: { name: "length" } }
};

/**
 * Type that contains a new name and transformation function for specific field.
 */
interface Transform {
  name: string;
  stringify?: Transformation<ContextElement, string>;
  transform?: Transformation<unknown, ContextElement>;
}

/**
 * Transformation function type that transforms object of type `V` to type `R`.
 */
interface Transformation<V, R> {
  (entity: V): R;
}

/**
 * Default `stringify` function used if no `stringify` function is provided.
 *
 * @param entity Entity that is being transformed.
 */
const DEFAULT_STRINGIFY: Transformation<ContextElement, string> = (
  entity: ContextElement
) => {
  if (Array.isArray(entity)) {
    return `[${entity.map(DEFAULT_STRINGIFY).join(", ")}]`;
  }

  return `${entity}`;
};

/**
 * Default transformation function used if no transform function is provided.
 *
 * @param entity Entity that is being transformed.
 */
const DEFAULT_TRANSFORM: Transformation<unknown, ContextElement> = (
  entity: unknown
) => {
  if (Array.isArray(entity)) {
    return entity;
  }

  if (typeof entity === "number") {
    return entity;
  }

  return `${entity}`;
};

/**
 * Maps Joi error types to message templates. `{field}` will be replaced by
 * corresponding field and other variables (in the form of `{VARIABLE}`) must
 * appear in this type's context template as renamed field.
 */
const TYPE_TO_MESSAGE: { [type: string]: string } = {
  "any.allowOnly": 'Field "{field}" must be one of {options}.',
  "any.empty": 'Field "{field}" must not be empty.',
  "any.required": 'Field "{field}" is required.',
  "object.allowUnknown": 'Field "{field}" was not expected.',
  "string.email": 'Field "{field}" must be a valid email.',
  "string.guid": 'Field "{field}" must be a valid GUID.',
  "string.min": 'Field "{field}" must be at least {length} characters long.'
};

/**
 * Creates a new `BadRequestError` from `Joi.ValidationError`.
 *
 * @param error Given `ValidationError`.
 */
export const createValidationError = (error: ValidationError) => {
  const details: ErrorDetail[] = [];

  for (const detail of error.details) {
    const type = detail.type;

    if (!(type in TYPE_TO_REASON)) {
      throw new InternalServerErrorError(
        `Error type "${type}" has no matching reason.`
      );
    }

    const field = detail.path.pop();

    if (field === undefined) {
      continue;
    }

    const template = TYPE_TO_CONTEXT_TEMPLATE[type];

    let message = TYPE_TO_MESSAGE[type].replace("{field}", field);
    let context: ErrorContext | undefined =
      template !== undefined ? {} : undefined;

    if (
      detail.context !== undefined &&
      template !== undefined &&
      context !== undefined
    ) {
      for (const key of Object.keys(template)) {
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
      location: { part: "body", field },
      reason: TYPE_TO_REASON[type],
      context,
      message
    });
  }

  return new BadRequestError("", ...details);
};

/**
 * Creates a new `UnauthorizedError` based on invalid fields.
 *
 * @param fields One or more invalid fields.
 */
export const createInvalidCredentialsError = (...fields: string[]) => {
  const message = `Incorrect ${fields
    .join(", ")
    .replace(/, ([^,]*)$/, " or $1")}.`;

  return new UnauthorizedError(
    message,
    ...fields.map(
      (field): ErrorDetail => ({
        location: { part: "body", field },
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
  field: string
) => {
  const message = `${entity} with ID "${id}" does not exist.`;

  return new BadRequestError(message, {
    location: { part: "body", field },
    reason: "incorrect",
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
    location: { part: "body", field },
    reason: "conflict",
    message
  });
};
