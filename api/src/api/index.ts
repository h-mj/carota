import * as Koa from "koa";

import * as bodyParser from "koa-bodyparser";

import { auth } from "./auth";

/**
 * Application that handles all requests to the API.
 */
export const api = new Koa();

api.use(bodyParser());
api.use(auth.routes());
