import { Middleware } from "koa";

import { Controllers, Data, Endpoints } from "../api";
import { Error, HttpError } from "../error/HttpError";
import { InternalServerErrorError } from "../error/InternalServerError";

/**
 * Type of an object within response message body of endpoint `TEndpoint` of
 * controller `TController`.
 */
export type Response<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> = DataResponse<TController, TEndpoint> | ErrorResponse;

/**
 * Type of an object within response message body if request was handled
 * successfully.
 */
export interface DataResponse<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> {
  /**
   * Responded data.
   */
  data: Data<TController, TEndpoint>;
}

/**
 * Type of an object within response message body if an error occurred.
 */
export interface ErrorResponse {
  /**
   * Occurred error description.
   */
  error: Error;
}

/**
 * Returns a middleware that wraps the whole application, handles all thrown
 * errors and creates a response to the request.
 */
export const responder = (): Middleware => async (
  context,
  next
): Promise<void> => {
  try {
    await next();

    if (context.method === "GET") {
      return; // Response should be already handled by `serve` application.
    }

    context.body = { data: context.state.data };
  } catch (error) {
    let httpError: HttpError;

    if (error instanceof HttpError) {
      httpError = error;
    } else {
      console.error(error);
      httpError = new InternalServerErrorError("Unknown error occurred.");
    }

    context.status = httpError.code;
    context.body =
      context.method === "GET"
        ? httpError.toString()
        : { error: httpError.toError() };
  }
};
