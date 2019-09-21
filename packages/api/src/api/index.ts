import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

import { bodyParserOnError } from "../utility/errors";
import { AccountController, accountRouter } from "./account";
import {
  AuthenticationController,
  authenticationRouter
} from "./authentication";
import { FoodController, foodRouter } from "./food";
import { InvitationController, invitationRouter } from "./invitation";

/**
 * Defines all API controllers.
 */
interface Api {
  account: AccountController;
  authentication: AuthenticationController;
  food: FoodController;
  invitation: InvitationController;
}

/**
 * Defines the request body type and response data type of some endpoint.
 */
export interface Query<TBody, TData> {
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
 * Union of endpoints of controller `TController`.
 */
export type Endpoints<TController extends Controllers> = keyof Api[TController];

/**
 * Body type of endpoint `TEndpoint` of controller `TController`.
 */
export type Body<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> = Api[TController][TEndpoint] extends Query<infer IBody, infer _>
  ? IBody
  : never;

/**
 * Data type of endpoint `TEndpoint` of controller `TController`.
 */
export type Data<
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
> = Api[TController][TEndpoint] extends Query<infer _, infer IData>
  ? IData
  : never;

/**
 * `bodyParser` middleware options.
 */
const BODY_PARSER_OPTIONS: Readonly<bodyParser.Options> = {
  enableTypes: ["json"],
  onerror: bodyParserOnError
};

/**
 * Application that handles all requests to the API.
 */
export const api = new Koa()
  .use(bodyParser(BODY_PARSER_OPTIONS))
  .use(accountRouter.routes())
  .use(authenticationRouter.routes())
  .use(foodRouter.routes())
  .use(invitationRouter.routes());
