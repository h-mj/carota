import { Middleware } from "koa";

import * as Router from "@koa/router";

import { Controllers, Endpoints } from "../api";
import {
  AuthenticationState,
  authenticator
} from "../middleware/authenticator";
import { validate, ValidationState, Validator } from "../middleware/validator";

/**
 * Defines a route on router `router` with url based on controller and endpoint
 * names, validation middleware which uses `validator` and middleware
 * `middleware`. `authentication` middleware is not used.
 *
 * @param router Router on which route is defined.
 * @param controller Controller name.
 * @param endpoint Controller endpoint name.
 * @param validator Validator which is used to validate the request body.
 * @param middleware Middleware that is run on this route.
 */
export const defineNoAuth = <
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
>(
  router: Router,
  controller: TController,
  endpoint: TEndpoint,
  validator: Validator<TController, TEndpoint>,
  middleware: Middleware<ValidationState<TController, TEndpoint>>
): void => {
  router.post(`/${controller}/${endpoint}`, validate(validator), middleware);
};

/**
 * Defines a route on router `router` with url based on controller and endpoint
 * names, validation middleware which uses `validator`, authentication
 * middleware and middleware `middleware`.
 *
 * @param router Router on which route is defined.
 * @param controller Controller name.
 * @param endpoint Controller endpoint name.
 * @param validator Validator which is used to validate the request body.
 * @param middleware Middleware that is run on this route.
 */
export const define = <
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
>(
  router: Router,
  controller: TController,
  endpoint: TEndpoint,
  validator: Validator<TController, TEndpoint>,
  middleware: Middleware<
    AuthenticationState & ValidationState<TController, TEndpoint>
  >
): void => {
  router.post(
    `/${controller}/${endpoint}`,
    authenticator(),
    validate(validator),
    middleware
  );
};
