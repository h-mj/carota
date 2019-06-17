import { ErrorDetail, ErrorResponse } from "../types";

/**
 * A HTTP error.
 */
export abstract class HttpError {
  /**
   * HTTP status code.
   */
  public code: number;

  /**
   * Reason phrase of the status.
   */
  public reason: string;

  /**
   * Human readable error message.
   */
  public message?: string;

  /**
   * Error details detailing where and why the error occurred.
   */
  public details?: ErrorDetail[];

  /**
   * Creates a new instance of `HttpError`.
   *
   * @param code Error code.
   * @param name Reason phrase of the status.
   * @param message Human readable error message.
   * @param details Error details detailing where and why the error occurred.
   */
  public constructor(
    code: number,
    reason: string,
    message?: string,
    ...details: ErrorDetail[]
  ) {
    this.code = code;
    this.reason = reason;
    this.message = message;
    this.details = details.length === 0 ? undefined : details;
  }

  /**
   * Converts this error into a response object.
   */
  public toResponse(): ErrorResponse {
    return {
      error: {
        code: this.code,
        reason: this.reason,
        message: this.message,
        details: this.details
      }
    };
  }

  /**
   * Returns string representation of this error.
   */
  public toString(): string {
    let string = `Error ${this.code} (${this.reason})`;

    if (this.message) {
      string += " - " + this.message;
    }

    if (this.details) {
      for (const detail of this.details) {
        string += `\n- "${detail.reason}" in ${detail.location.part}`;

        if (detail.location.field) {
          string += ` (field "${detail.location.field}")`;
        }

        if (detail.message) {
          string += ` - ${detail.message}`;
        }
      }
    }

    return string;
  }
}
