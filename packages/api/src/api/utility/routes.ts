import * as Router from "@koa/router";
import { Middleware } from "koa";

import { Actions, Controllers } from "../../../types";
import {
  AuthenticationState,
  authenticator
} from "../middleware/authenticator";
import { ValidationState, Validator, validate } from "../middleware/validator";

/**
 * Defines a route on router `router` with url based on controller and action
 * names, validation middleware which uses `validator` and middleware
 * `middleware`. `authentication` middleware is not used.
 *
 * @param router Router on which route is defined.
 * @param controller Controller name.
 * @param action Controllers action name.
 * @param validator Validator which is used to validate the request body.
 * @param middleware Middleware that is run on this route.
 */
export const defineNoAuth = <
  TController extends Controllers,
  TAction extends Actions<TController>
>(
  router: Router,
  controller: TController,
  action: TAction,
  validator: Validator<TController, TAction>,
  middleware: Middleware<ValidationState<TController, TAction>>
): void => {
  router.post(`/${controller}/${action}`, validate(validator), middleware);
};

/**
 * Defines a route on router `router` with url based on controller and action
 * names, validation middleware which uses `validator`, authentication
 * middleware and middleware `middleware`.
 *
 * @param router Router on which route is defined.
 * @param controller Controller name.
 * @param action Controllers action name.
 * @param validator Validator which is used to validate the request body.
 * @param middleware Middleware that is run on this route.
 */
export const define = <
  TController extends Controllers,
  TAction extends Actions<TController>
>(
  router: Router,
  controller: TController,
  action: TAction,
  validator: Validator<TController, TAction>,
  middleware: Middleware<
    AuthenticationState & ValidationState<TController, TAction>
  >
): void => {
  router.post(
    `/${controller}/${action}`,
    authenticator(),
    validate(validator),
    middleware
  );
};
