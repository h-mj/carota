/**
 * Interface that holds all available routes as keys alongside with it's request
 * and response message types as values.
 */
interface RouteTypes {
  "/auth/login": RouteType<AuthLoginBody, AuthData>;
  "/auth/register": RouteType<AuthRegisterBody, AuthData>;
}

/**
 * Route types. `TBody` corresponds to the type of request message body, `TData`
 * to type of field `data` in response message body.
 */
interface RouteType<TBody, TData> {
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
export type Route = keyof RouteTypes;

/**
 * Body type of the route `TRoute`.
 */
export type Body<TRoute extends Route> = RouteTypes[TRoute]["body"];

/**
 * Data type of the route `TRoute`.
 */
export type Data<TRoute extends Route> = RouteTypes[TRoute]["data"];

/**
 * Type of an object within response message body on route `TRoute`.
 */
export type Response<TRoute extends Route> =
  | DataResponse<TRoute>
  | ErrorResponse;

/**
 * Type of an object within response message body if request was handled
 * successfully.
 */
export interface DataResponse<TRoute extends Route> {
  /**
   * Responded data.
   */
  data: Data<TRoute>;
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
  reason: ErrorReasons;

  /**
   * Extra information about the occurred error.
   */
  context?: ErrorContext;

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
   * Header or object field that is related to the occurred error. `undefined` if
   * there isn't a specific field that is related to the error.
   */
  field?: string;
}

/**
 * Part of the request message where the error occurred.
 */
export type ErrorLocationParts = "request-line" | "headers" | "body";

/**
 * Error reason type containing all possible reasons.
 */
export type ErrorReasons =
  | "empty"
  | "missing"
  | "invalid"
  | "incorrect"
  | "conflict"
  | "unexpected";

/**
 * Extra information about the occurred error.
 *
 * For example if there's a string length validation, then the limit must be
 * provided in some field.
 */
export interface ErrorContext {
  [key: string]: ErrorContextElement;
}

/**
 * Type of context field value.
 */
export type ErrorContextElement = string | number | string[];

/**
 * Type that is used to create enum like objects with given constants
 * `TConstants`.
 */
export type Enum<TConstants extends string> = {
  readonly [Constant in TConstants]: Constant;
};

/**
 * Union of all languages.
 */
export type Languages = "English" | "Estonian" | "Russian";

/**
 * Union of all account types.
 */
export type AccountTypes = "Default" | "Adviser";

/**
 * Union of all account rights.
 */
export type AccountRights = "Default" | "All";

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
 * Register request message body type.
 */
export interface AuthRegisterBody {
  /**
   * Personal name.
   */
  name: string;

  /**
   * Account language.
   */
  language: Languages;

  /**
   * Account email.
   */
  email: string;

  /**
   * Account password.
   */
  password: string;

  /**
   * Invitation ID.
   */
  invitationId: string;
}

/**
 * Union of all sexes.
 */
export type Sexes = "Female" | "Male";

/**
 * Login response message data type.
 */
export interface AuthData {
  /**
   * Generated JWT token.
   */
  token: string;
}
