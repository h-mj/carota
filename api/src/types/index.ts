/**
 * Type of an object within response message body.
 */
export type IResponse = IDataResponse | IErrorResponse;

/**
 * Type of an object within response message body if request was handled
 * successfully.
 */
export interface IDataResponse {
  /**
   * Responded data.
   */
  data: any;
}

/**
 * Type of an object within response message body if an error occurred.
 */
export interface IErrorResponse {
  /**
   * Occurred error description.
   */
  error: IError;
}

/**
 * Type that describes occurred error.
 */
export interface IError {
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
  details?: IDetail[];
}

/**
 * Type that describes one of the locations and the reasons of the occurred error.
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
  message?: string;
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
