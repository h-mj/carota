import { Actions, Body, Controllers, Data } from "../../../types";
import { Middleware } from "koa";
import * as Joi from "@hapi/joi";
import { createValidationError } from "../utility/errors";

/**
 * Schema object type of given object `TObject`.
 */
type SchemaType<T> = T extends object
  ? { [P in keyof T]-?: SchemaType<T[P]> }
  : T extends undefined
  ? undefined
  : Joi.SchemaLike;

/**
 * Schema for body of action `TAction` of controller `TController`.
 */
export type Schema<
  TController extends Controllers,
  TAction extends Actions<TController>
> = SchemaType<Body<TController, TAction>>;

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
 * `schema`. Throws an error if any errors occurred or assigns validation result
 * to `context.state.body`.
 *
 * @param schema Schema to be validated on `context.request.body`.
 *
 * @throws `BadRequestError` if any validation errors occurred.
 */
export const validator = <
  TController extends Controllers,
  TAction extends Actions<TController>
>(
  schema: Schema<TController, TAction>
): Middleware<ValidationState<TController, TAction>> => async (
  context,
  next
) => {
  if (schema === undefined) {
    return next();
  }

  const { error, value } = Joi.validate<Body<TController, TAction>>(
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
