import { Middleware } from "koa";
import { Body, Route, State } from "../../types";
import * as Joi from "@hapi/joi";
import { createValidationError } from "../utility/errors";

/**
 * Schema for body of route `TRoute`.
 */
export type Schema<TRoute extends Route> = {
  [P in keyof Body<TRoute>]: Joi.SchemaLike;
};

/**
 * Export `Joi` as `is` for shorter schemas.
 */
export const is = Joi;

/**
 * Validation options that are used in middleware returned by `validator`
 * function.
 */
const VALIDATION_OPTIONS: Joi.ValidationOptions = {
  abortEarly: false,
  presence: "required"
};

/**
 * Returns a middleware that validates `context.request.body` using given
 * `schema`. Throws an error if any errors occurred or assigns validation result
 * to `context.state.body`.
 *
 * @param schema Schema to be validated on `context.request.body`.
 */
export const validator = <TRoute extends Route>(
  schema: Schema<TRoute>
): Middleware<State<TRoute>> => async (context, next) => {
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
