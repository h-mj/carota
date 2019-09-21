import { compare } from "bcryptjs";
import { deviate, Success } from "deviator";

import * as Router from "@koa/router";

import { Account } from "../entity/Account";
import { generateToken } from "../middleware/authenticator";
import { createInvalidCredentialsError } from "../utility/errors";
import { defineNoAuth } from "../utility/routes";
import { Query } from "./";

/**
 * Router which endpoints manage the authentication.
 */
export const authenticationRouter = new Router();

/**
 * Defines the request and response message body types of authentication router
 * endpoints.
 */
export interface AuthenticationController {
  generateToken: Query<GenerateAuthenticationTokenDto, AuthenticationTokenDto>;
}

/**
 * Validates generate authentication token request body.
 */
// prettier-ignore
const generateAuthenticationTokenDtoValidator = deviate().object().shape({
  email: deviate().string().trim().lowercase().notEmpty(),
  password: deviate().string().notEmpty()
})

/**
 * Generate authentication token request data transfer object.
 */
type GenerateAuthenticationTokenDto = Success<
  typeof generateAuthenticationTokenDtoValidator
>;

/**
 * Authentication token data transfer object.
 */
export interface AuthenticationTokenDto {
  token: string;
}

defineNoAuth(
  authenticationRouter,
  "authentication",
  "generateToken",
  generateAuthenticationTokenDtoValidator,
  async context => {
    const { email, password } = context.state.body;

    const account = await Account.findOne({ email });

    if (account === undefined || !(await compare(password, account.hash))) {
      throw createInvalidCredentialsError(["email"], ["password"]);
    }

    context.state.data = { token: generateToken(account) };
  }
);
