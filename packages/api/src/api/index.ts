import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

import { accountRouter } from "./account";
import { foodRouter } from "./food";
import { invitationRouter } from "./invitation";
import { bodyParserOnError } from "./utility/errors";

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
  .use(foodRouter.routes())
  .use(invitationRouter.routes());
