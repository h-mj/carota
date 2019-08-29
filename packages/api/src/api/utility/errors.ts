import { ErrorDetail } from "../../../types";
import { BadRequestError } from "../../error/BadRequestError";
import { UnauthorizedError } from "../../error/UnauthorizedError";
import { ErrorTree } from "../middleware/validator";

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
 * Creates an array of `ErrorDetail` from specified `ErrorTree` value.
 *
 * @param tree Error tree value.
 * @param path Tree node path.
 */
const createDetails = (tree: ErrorTree, path: string[] = []): ErrorDetail[] => {
  if (tree === undefined) {
    return [];
  }

  if (typeof tree === "string") {
    return [{ location: { part: "body", path }, reason: tree }];
  }

  const details: ErrorDetail[] = [];

  for (const property in tree) {
    details.push(...createDetails(tree[property], path.concat([property])));
  }

  return details;
};

/**
 * Creates a new `BadRequestError` from `ErrorTree`.
 *
 * @param tree Specified `ErrorTree`.
 */
export const createValidationError = (tree: ErrorTree): BadRequestError => {
  console.log(createDetails(tree));

  return new BadRequestError(
    "One or more fields failed validation.",
    ...createDetails(tree)
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
