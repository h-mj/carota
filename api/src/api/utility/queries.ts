import { createUniqueConstraintError } from "./errors";

export const callCatch = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.log("XD");
    console.log(typeof error.detail);

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
