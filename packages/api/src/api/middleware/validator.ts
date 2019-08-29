import { Deviation } from "deviator/lib/deviator";
import { Middleware } from "koa";

import { Actions, Body, Controllers, Data } from "../../../types";
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
  TAction extends Actions<TController>
> = Deviation<
  unknown,
  Body<TController, TAction>,
  Body<TController, TAction>,
  ErrorTree
>;

/**
 * Middleware state type after validation of `TAction` action of `TController`
 * controller request body has been run.
 */
export interface ValidationState<
  TController extends Controllers,
  TAction extends Actions<TController>
> {
  /**
   * Body type of this route.
   */
  body: Body<TController, TAction>;

  /**
   * Data type of this route.
   */
  data: Data<TController, TAction>;
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
  TAction extends Actions<TController>
>(
  validator: Validator<TController, TAction>
): Middleware<ValidationState<TController, TAction>> => async (
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
