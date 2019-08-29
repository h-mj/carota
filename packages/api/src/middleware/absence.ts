import { Middleware } from "koa";

import { NotFoundError } from "../error/NotFoundError";

/**
 * Returns a middleware that always throws a `NotFoundError`.
 *
 * This middleware is used as last middleware in middleware chain. If this
 * middleware is reached, then none of the previously run functions handled the
 * request.
 */
export const absence = (): Middleware => async (): Promise<void> => {
  throw new NotFoundError();
};
