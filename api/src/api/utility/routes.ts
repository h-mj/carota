import { Middleware } from "koa";
import * as Router from "koa-router";
import { Route } from "../../types";
import { Schema, validator, ValidationState } from "../middleware/validator";
import {
  authenticator,
  AuthenticationState
} from "../middleware/authenticator";

export const defineNoAuth = <TRoute extends Route>(
  router: Router,
  route: TRoute,
  schema: Schema<TRoute>,
  middleware: Middleware<ValidationState<TRoute>>
) => {
  router.post(route, validator(schema), middleware);
};

export const define = <TRoute extends Route>(
  router: Router,
  route: TRoute,
  schema: Schema<TRoute>,
  middleware: Middleware<AuthenticationState & ValidationState<TRoute>>
) => {
  router.post(route, authenticator(), validator(schema), middleware);
};
