import * as Router from "koa-router";
import { define } from "./utility/routes";
import { Schema, is } from "./middleware/validator";

/**
 * Router, which handles all routes related to authentication.
 */
export const auth = new Router();

/**
 * Login request body schema.
 */
const loginSchema: Schema<"/auth/login"> = {
  email: is.string().email(),
  password: is.string().min(8)
};

define(auth, "/auth/login", loginSchema, async context => {
  context.state.data = { token: "Hello there" };
});
