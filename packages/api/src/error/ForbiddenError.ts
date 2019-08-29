import { ErrorDetail } from "../../types";
import { HttpError } from "./HttpError";

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
