import { Deviation } from "deviator/lib/deviator";
import { Middleware } from "koa";

import { Body, Controllers, Data, Endpoints } from "../api";
import { createValidationError } from "../utility/errors";

/**
 * Generic validation error type.
 */
export type ErrorTree = undefined | string | { [P: string]: ErrorTree };

/**
 * Deviation which successful result type is `T`.
 */
export type Validator<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> = Deviation<
  unknown,
  Body<TController, TEndpoint>,
  Body<TController, TEndpoint>,
  ErrorTree
>;

/**
 * Middleware state type after validation of `TEndpoint` endpoint of `TController`
 * controller request body has been run.
 */
export interface ValidationState<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> {
  /**
   * Body type of this route.
   */
  body: Body<TController, TEndpoint>;

  /**
   * Data type of this route.
   */
  data: Data<TController, TEndpoint>;
}

/**
 * Returns a middleware that validates `context.request.body` using given
 * `validator`. Throws an error if any errors occurred or assigns validation
 * result to `context.state.body`.
 *
 * @param validator Validator function for `context.request.body`.
 *
 * @throws `BadRequestError` if any validation errors occurred.
 */
export const validate = <
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
>(
  validator: Validator<TController, TEndpoint>
): Middleware<ValidationState<TController, TEndpoint>> => async (
  context,
  next
): Promise<void> => {
  const result = validator(context.request.body);

  if (!result.ok) {
    throw createValidationError(result.value);
  }

  context.state.body = result.value;

  await next();
};
