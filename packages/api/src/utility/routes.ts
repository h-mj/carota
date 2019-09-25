import { Middleware } from "koa";

import * as Router from "@koa/router";

import { Body, Controllers, Data, Endpoints } from "../api";
import { Account } from "../entity/Account";
import {
  AuthenticationState,
  authenticator
} from "../middleware/authenticator";
import { validate, ValidationState, Validator } from "../middleware/validator";

/**
 * Endpoint handler function type.
 */
type Handler<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> = (
  body: Body<TController, TEndpoint>,
  account: Account
) => Promise<Data<TController, TEndpoint>>;

/**
 * Wraps specified handler inside a middleware.
 */
const wrap = <
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
>(
  handler: Handler<TController, TEndpoint>
): Middleware<
  AuthenticationState & ValidationState<TController, TEndpoint>
> => async context => {
  context.state.data = await handler(context.state.body, context.state.account);
};

/**
 * No auth endpoint handler function type.
 */
type NoAuthHandler<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> = (
  body: Body<TController, TEndpoint>
) => Promise<Data<TController, TEndpoint>>;

/**
 * Wraps specified no auth handler inside a middleware.
 */
const noAuthWrap = <
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
>(
  handler: NoAuthHandler<TController, TEndpoint>
): Middleware<
  AuthenticationState & ValidationState<TController, TEndpoint>
> => async context => {
  context.state.data = await handler(context.state.body);
};

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
  handler: NoAuthHandler<TController, TEndpoint>
): void => {
  router.post(
    `/${controller}/${endpoint}`,
    validate(validator),
    noAuthWrap(handler)
  );
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
  handler: Handler<TController, TEndpoint>
): void => {
  router.post(
    `/${controller}/${endpoint}`,
    authenticator(),
    validate(validator),
    wrap(handler)
  );
};
