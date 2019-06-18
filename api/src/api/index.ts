import * as Koa from "koa";

import * as bodyParser from "koa-bodyparser";

import { authRouter } from "./auth";

import { bodyParserOnError } from "./utility/errors";

const BODY_PARSER_OPTIONS: bodyParser.Options = {
  enableTypes: ["json"],
  onerror: bodyParserOnError
};

/**
 * Application that handles all requests to the API.
 */
export const api = new Koa();

api.use(bodyParser(BODY_PARSER_OPTIONS)).use(authRouter.routes());
