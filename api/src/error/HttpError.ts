/**
 * Type that describes the location and the reason of the occurred error.
 */
export interface IDetail {
  /**
   * Location of the error;
   */
  location: ILocation;

  /**
   * Reason phrase of the the occurred error.
   */
  reason: string;

  /**
   * Human readable error message.
   */
  message: string;
}

/**
 * Type that describes the location of the occurred error.
 */
export interface ILocation {
  /**
   * HTTP request message part that is related to the occurred error.
   */
  part: "request-line" | "headers" | "body";

  /**
   * Header or object field that is related to the occurred error. `undefined` if
   * there isn't a specific field that is related to the error.
   */
  field?: string;
}

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
  public details?: IDetail[];

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
    ...details: IDetail[]
  ) {
    this.code = code;
    this.reason = reason;
    this.message = message;
    this.details = details.length === 0 ? undefined : details;
  }
}
