import { HttpError } from "./HttpError";

/**
 * HTTP 500 (Internal Server Error) error.
 */
export class InternalServerErrorError extends HttpError {
  /**
   * Creates a new instance of `InternalServerErrorError`.
   */
  public constructor(message?: string) {
    super(500, "Internal Server Error", message);
  }
}
