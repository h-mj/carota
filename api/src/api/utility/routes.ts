import { Middleware } from "koa";
import * as Router from "koa-router";
import { Route } from "../../types";
import { Schema, validator, ValidationState } from "../middleware/validator";
import {
  authenticator,
  AuthenticationState
} from "../middleware/authenticator";

/**
 * Defines a route `route` on router `router` with validation middleware using
 * schema `schema` and middleware `middleware`. `authentication` middleware is
 * not used.
 *
 * @param router Router on which route is defined.
 * @param route Request path.
 * @param schema Schema using which request body is validated.
 * @param middleware Middleware that is run on this route.
 */
export const defineNoAuth = <TRoute extends Route>(
  router: Router,
  route: TRoute,
  schema: Schema<TRoute>,
  middleware: Middleware<ValidationState<TRoute>>
) => {
  router.post(route, validator(schema), middleware);
};

/**
 * Defines a route `route` on router `router` with validation middleware using
 * schema `schema`, authentication middleware and middleware `middleware`.
 *
 * @param router Router on which route is defined.
 * @param route Request path.
 * @param schema Schema using which request body is validated.
 * @param middleware Middleware that is run on this route.
 */
export const define = <TRoute extends Route>(
  router: Router,
  route: TRoute,
  schema: Schema<TRoute>,
  middleware: Middleware<AuthenticationState & ValidationState<TRoute>>
) => {
  router.post(route, authenticator(), validator(schema), middleware);
};
