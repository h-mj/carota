import { Middleware } from "koa";
import * as Router from "koa-router";
import { Route, State } from "../../types";
import { Schema, validator } from "../middleware/validator";

export const define = <TRoute extends Route>(
  router: Router,
  route: TRoute,
  schema: Schema<TRoute>,
  middleware: Middleware<State<TRoute>>
) => {
  router.post(route, validator(schema), middleware);
};
