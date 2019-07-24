import { Middleware } from "koa";
import * as Router from "@koa/router";
import { Actions, Controllers } from "../../../types";
import { Schema, validator, ValidationState } from "../middleware/validator";
import {
  authenticator,
  AuthenticationState
} from "../middleware/authenticator";

/**
 * Defines a route on router `router` with url based on controller and action
 * names, validation middleware using schema `schema` and middleware
 * `middleware`. `authentication` middleware is not used.
 *
 * @param router Router on which route is defined.
 * @param controller Controller name.
 * @param action Controllers action name.
 * @param schema Schema using which request body is validated.
 * @param middleware Middleware that is run on this route.
 */
export const defineNoAuth = <
  TController extends Controllers,
  TAction extends Actions<TController>
>(
  router: Router,
  controller: TController,
  action: TAction,
  schema: Schema<TController, TAction>,
  middleware: Middleware<ValidationState<TController, TAction>>
) => {
  router.post(`/${controller}/${action}`, validator(schema), middleware);
};

/**
 * Defines a route on router `router` with url based on controller and action
 * names, validation middleware using schema `schema`, authentication middleware
 * and middleware `middleware`.
 *
 * @param router Router on which route is defined.
 * @param controller Controller name.
 * @param action Controllers action name.
 * @param schema Schema using which request body is validated.
 * @param middleware Middleware that is run on this route.
 */
export const define = <
  TController extends Controllers,
  TAction extends Actions<TController>
>(
  router: Router,
  controller: TController,
  action: TAction,
  schema: Schema<TController, TAction>,
  middleware: Middleware<
    AuthenticationState & ValidationState<TController, TAction>
  >
) => {
  router.post(
    `/${controller}/${action}`,
    authenticator(),
    validator(schema),
    middleware
  );
};
