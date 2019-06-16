import { HttpError } from "./HttpError";

/**
 * HTTP 404 (Not Found) error.
 */
export class NotFoundError extends HttpError {
  /**
   * Creates a new instance of `NotFoundError`.
   */
  public constructor() {
    super(404, "Not Found");
  }
}
