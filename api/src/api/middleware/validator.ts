import { Middleware } from "koa";
import { Body, Data, Route } from "../../types";
import * as Joi from "@hapi/joi";
import { createValidationError } from "../utility/errors";

/**
 * Schema for body of route `TRoute`.
 */
export type Schema<TRoute extends Route> = {
  [P in keyof Body<TRoute>]: Joi.SchemaLike;
};

/**
 * Export `Joi` as `is` for shorter schema definitions.
 */
export const is = Joi;

/**
 * Validation options that are used in middleware returned by `validator`
 * function.
 */
const VALIDATION_OPTIONS: Readonly<Joi.ValidationOptions> = {
  abortEarly: false,
  presence: "required"
};

/**
 * `TRoute` route middleware state type after validation has been run.
 */
export interface ValidationState<TRoute extends Route> {
  /**
   * Body type of this route.
   */
  body: Body<TRoute>;

  /**
   * Data type of this route.
   */
  data: Data<TRoute>;
}

/**
 * Returns a middleware that validates `context.request.body` using given
 * `schema`. Throws an error if any errors occurred or assigns validation result
 * to `context.state.body`.
 *
 * @param schema Schema to be validated on `context.request.body`.
 *
 * @throws `BadRequestError` if any validation errors occurred.
 */
export const validator = <TRoute extends Route>(
  schema: Schema<TRoute>
): Middleware<ValidationState<TRoute>> => async (context, next) => {
  const { error, value } = Joi.validate<Body<TRoute>>(
    context.request.body,
    schema,
    VALIDATION_OPTIONS
  );

  if (error !== null) {
    throw createValidationError(error);
  }

  context.state.body = value;

  return next();
};
