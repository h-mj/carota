import { HttpError } from "./HttpError";
import { ErrorDetail } from "../../types";

/**
 * HTTP 400 (Bad Request) error.
 */
export class BadRequestError extends HttpError {
  /**
   * Creates a new instance of `BadRequestError`.
   */
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(400, "Bad Request", message, ...details);
  }
}
