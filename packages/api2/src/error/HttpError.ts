/**
 * Type that describes occurred error.
 */
export interface ErrorDto {
  /**
   * HTTP status code.
   */
  code: number;

  /**
   * Reason phrase of the status.
   */
  reason: string;

  /**
   * Human readable error message.
   */
  message?: string;

  /**
   * Error details detailing where and why the error occurred.
   */
  details?: ErrorDetail[];
}

/**
 * Type that describes one of the locations and the reasons of the occurred error.
 */
export interface ErrorDetail {
  /**
   * Location of the error;
   */
  location: ErrorLocation;

  /**
   * Reason phrase of the the occurred error.
   */
  reason: string;

  /**
   * Human readable error message.
   */
  message?: string;
}

/**
 * Type that describes the location of the occurred error.
 */
export interface ErrorLocation {
  /**
   * HTTP request message part that is related to the occurred error.
   */
  part: ErrorLocationParts;

  /**
   * Path to specific field that is related to the occurred error. `undefined`
   * if there isn't a specific field that is related to the error.
   */
  path?: string[];
}

/**
 * Part of the request message where the error occurred.
 */
export type ErrorLocationParts = "request-line" | "headers" | "body";

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
   * Creates the error data transfer object of this error.
   */
  public toDto = (): ErrorDto => ({
    code: this.code,
    reason: this.reason,
    message: this.message,
    details: this.details
  });
}
