import { HttpError } from "./HttpError";
import { ErrorDetail } from "../types";

/**
 * HTTP 404 (Not Found) error.
 */
export class NotFoundError extends HttpError {
  /**
   * Creates a new instance of `NotFoundError`.
   */
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(404, "Not Found", message, ...details);
  }
}
