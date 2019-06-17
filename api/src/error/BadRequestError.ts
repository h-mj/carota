import { HttpError } from "./HttpError";

/**
 * HTTP 400 (Bad Request) error.
 */
export class BadRequestError extends HttpError {
  /**
   * Creates a new instance of `BadRequestError`.
   */
  public constructor() {
    super(400, "Bad Request");
  }
}
