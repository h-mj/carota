import { Middleware } from "koa";
import { NotFoundError } from "../error/NotFoundError";

/**
 * Returns a middleware that always throws a `NotFoundError`.
 */
export const absence = (): Middleware => async () => {
  throw new NotFoundError();
};
