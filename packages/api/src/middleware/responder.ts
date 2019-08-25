import { Middleware } from "koa";
import { HttpError } from "../error/HttpError";
import { InternalServerErrorError } from "../error/InternalServerError";

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
      context.method === "GET" ? httpError.toString() : httpError.toResponse();
  }
};
