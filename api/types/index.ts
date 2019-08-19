/**
 * Defines controllers, their actions, and request and response message body
 * data types.
 */
interface Api {
  account: {
    login: Query<AccountLoginBody, TokenData>;
    register: Query<AccountRegisterBody, TokenData>;
  };
  food: {
    save: Query<FoodSaveBody, FoodData>;
    search: Query<FoodSearchBody, FoodData[]>;
  };
  invitation: {
    get: Query<IdBody, InvitationData>;
  };
}

/**
 * Defines the request body type and response data type of some action.
 */
interface Query<TBody, TData> {
  /**
   * Type of an object within request message body.
   */
  body: TBody;

  /**
   * Property `data` inside the object within response message body value type.
   */
  data: TData;
}

/**
 * Union of controller names.
 */
export type Controllers = keyof Api;

/**
 * Union of actions of controller `TController`.
 */
export type Actions<TController extends Controllers> = keyof Api[TController];

/**
 * Body type of the action `TAction` of controller `TController`.
 */
export type Body<
  TController extends Controllers,
  TAction extends Actions<TController>
> = Api[TController][TAction] extends Query<infer IBody, infer _>
  ? IBody
  : never;

/**
 * Data type of the action `TAction` of controller `TController`.
 */
export type Data<
  TController extends Controllers,
  TAction extends Actions<TController>
> = Api[TController][TAction] extends Query<infer _, infer IData>
  ? IData
  : never;

/**
 * Type of an object within response message body of action `TAction` of
 * controller `TController`.
 */
export type Response<
  TController extends Controllers,
  TAction extends Actions<TController>
> = DataResponse<TController, TAction> | ErrorResponse;

/**
 * Type of an object within response message body if request was handled
 * successfully.
 */
export interface DataResponse<
  TController extends Controllers,
  TAction extends Actions<TController>
> {
  /**
   * Responded data.
   */
  data: Data<TController, TAction>;
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
 * Error reason type containing all possible reasons.
 */
export type ErrorReasons =
  | "conflict"
  | "empty"
  | "incorrect"
  | "invalid"
  | "missing"
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
 * Union of all sexes.
 */
export type Sexes = "Female" | "Male";

/**
 * Union of all units.
 */
export type Units = "g" | "ml";

/**
 * Login request message body type.
 */
export interface AccountLoginBody {
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
export interface AccountRegisterBody {
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
 * Entity request by ID body.
 */
export interface IdBody {
  /**
   * ID of the requested entity.
   */
  id: string;
}

/**
 * Generated JSON Web Token data type.
 */
export interface TokenData {
  /**
   * Generated JSON Web Token.
   */
  token: string;
}

/**
 * Invitation entity data type.
 */
export interface InvitationData {
  /**
   * Invitation ID.
   */
  id: string;

  /**
   * Account type of future account.
   */
  type: string;

  /**
   * Account rights of future account.
   */
  rights: string;
}

/**
 * Declares nutritional values of a product.
 */
export interface NutritionDeclarationData {
  /**
   * Amount of energy in kilocalories.
   */
  energy: number;

  /**
   * Amount of fat in grams.
   */
  fat: number;

  /**
   * Amount of saturates in grams.
   */
  saturates?: number;

  /**
   * Amount of mono-unsaturates in grams.
   */
  monoUnsaturates?: number;

  /**
   * Amount of polyunsaturates in grams.
   */
  polyunsaturates?: number;

  /**
   * Amount of carbohydrate in grams.
   */
  carbohydrate: number;

  /**
   * Amount of sugars in grams.
   */
  sugars?: number;

  /**
   * Amount of polyols in grams.
   */
  polyols?: number;

  /**
   * Amount of starch in grams.
   */
  starch?: number;

  /**
   * Amount of fibre in grams.
   */
  fibre?: number;

  /**
   * Amount of protein in grams.
   */
  protein: number;

  /**
   * Amount of salt in grams.
   */
  salt?: number;
}

/**
 * Save food request message body type.
 */
export interface FoodSaveBody {
  /**
   * Food ID, if updating.
   */
  id?: string;

  /**
   * The name of the food.
   */
  name: string;

  /**
   * Barcode of the food, if exists.
   */
  barcode?: string;

  /**
   * Serving unit.
   */
  unit: Units;

  /**
   * Food nutrition declaration.
   */
  nutritionDeclaration: NutritionDeclarationData;

  /**
   * Quantity of one piece in units, if one piece of product exists.
   */
  pieceQuantity?: number;
}

/**
 * Search food request message body type.
 */
export interface FoodSearchBody {
  /**
   * Search query string.
   */
  query: string;
}

/**
 * Save food response message data type.
 */
export interface FoodData {
  /**
   * Food ID.
   */
  id: string;

  /**
   * The name of the food.
   */
  name: string;

  /**
   * Barcode of the food, if exists.
   */
  barcode?: string;

  /**
   * Serving unit.
   */
  unit: Units;

  /**
   * Food nutrition declaration.
   */
  nutritionDeclaration: NutritionDeclarationData;

  /**
   * Quantity of one piece in units, if one piece of product exists.
   */
  pieceQuantity?: number;
}
