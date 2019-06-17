/**
 * Type of an object within response message body.
 */
export type IResponse<T> = DataResponse<T> | ErrorResponse;

/**
 * Type of an object within response message body if request was handled
 * successfully.
 */
export interface DataResponse<T> {
  /**
   * Responded data.
   */
  data: T;
}

/**
 * Type of an object within response message body if an error occurred.
 */
export interface ErrorResponse {
  /**
   * Occurred error description.
   */
  error: Error;
}

/**
 * Type that describes occurred error.
 */
export interface Error {
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
  part: "request-line" | "headers" | "body";

  /**
   * Header or object field that is related to the occurred error. `undefined` if
   * there isn't a specific field that is related to the error.
   */
  field?: string;
}
