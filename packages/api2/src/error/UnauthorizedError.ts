import { ErrorDetail, HttpError } from "./HttpError";

/**
 * HTTP 401 (Unauthorized) error.
 */
export class UnauthorizedError extends HttpError {
  /**
   * Creates a new instance of `UnauthorizedError`.
   */
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(401, "Unauthorized", message, ...details);
  }
}
