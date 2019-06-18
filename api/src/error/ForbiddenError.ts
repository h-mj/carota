import { HttpError } from "./HttpError";
import { ErrorDetail } from "../types";

/**
 * HTTP 403 (Forbidden) error.
 */
export class ForbiddenError extends HttpError {
  /**
   * Creates a new instance of `ForbiddenError`.
   */
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(403, "Forbidden", message, ...details);
  }
}
