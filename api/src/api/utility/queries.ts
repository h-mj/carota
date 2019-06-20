import { createUniqueConstraintError } from "./errors";

/**
 * Wrapper function for database calls that catches database specific errors and
 * throws `HttpError` type errors instead.
 *
 * @throws `BadRequestError` if unique constraint error was caught.
 */
export const callCatch = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (error.code === "23505" /* unique constraint */) {
      // error detail should look like `Key ({field})=({value}) already exists.`
      // and we want to get `{field}` value.
      const detail = error.detail as string;

      const field = detail.substring(
        detail.indexOf("(") + 1,
        detail.indexOf(")")
      );

      throw createUniqueConstraintError(field);
    }

    throw error;
  }
};
