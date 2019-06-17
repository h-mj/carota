import { HttpError } from "./HttpError";
import { ErrorDetail } from "../types";

/**
 * HTTP 500 (Internal Server Error) error.
 */
export class InternalServerErrorError extends HttpError {
  /**
   * Creates a new instance of `InternalServerErrorError`.
   */
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(500, "Internal Server Error", message, ...details);
  }
}
