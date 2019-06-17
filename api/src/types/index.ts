/**
 * Interface that holds all available routes as keys alongside with it's request
 * and response message types as values.
 */
interface Routes {
  "/auth/login": Types<AuthLoginBody, AuthData>;
}

/**
 * Route types. `TBody` corresponds to the type of request message body, `TData`
 * to type of field `data` in response message body.
 */
interface Types<TBody, TData> {
  /**
   * Type of object that is within request message body.
   */
  body: TBody;

  /**
   * Type of field `data` of the object within response message body.
   */
  data: TData;
}

/**
 * Route type.
 */
export type Route = keyof Routes;

/**
 * State types.
 */
export type State<TRoute extends Route> = Routes[TRoute];

/**
 * Body type of the route `TRoute`.
 */
export type Body<TRoute extends Route> = State<TRoute>["body"];

/**
 * Data type of the route `TRoute`.
 */
export type Data<TRoute extends Route> = State<TRoute>["data"];

/**
 * Type of an object within response message body.
 */
export type Response<TData> = DataResponse<TData> | ErrorResponse;

/**
 * Type of an object within response message body if request was handled
 * successfully.
 */
export interface DataResponse<TData> {
  /**
   * Responded data.
   */
  data: TData;
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

/**
 * Login request message body type.
 */
export interface AuthLoginBody {
  /**
   * Account email.
   */
  email: string;

  /**
   * Account password.
   */
  password: string;
}

/**
 * Login response message data type.
 */
export interface AuthData {
  /**
   * Generated JWT token.
   */
  token: string;
}
