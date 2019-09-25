import { compare } from "bcryptjs";
import { deviate, Success } from "deviator";

import * as Router from "@koa/router";

import { Account } from "../entity/Account";
import { signToken } from "../middleware/authenticator";
import { createInvalidCredentialsError } from "../utility/errors";
import { defineNoAuth } from "../utility/routes";
import { Query } from "./";

/**
 * Validates generate authentication token request body.
 */
// prettier-ignore
const generateAuthenticationTokenDtoValidator = deviate().object().shape({
  email: deviate().string().trim().lowercase().notEmpty(),
  password: deviate().string().notEmpty()
})

/**
 * Generate authentication token request data transfer object type.
 */
type GenerateAuthenticationTokenDto = Success<
  typeof generateAuthenticationTokenDtoValidator
>;

/**
 * Authentication token data transfer object type.
 */
export interface AuthenticationTokenDto {
  token: string;
}

/**
 * Authorizes account with specified credentials and generates the JWT for that
 * account.
 */
const generateToken = async ({
  email,
  password
}: GenerateAuthenticationTokenDto) => {
  const account = await Account.findOne({ email });

  if (account === undefined || !(await compare(password, account.hash))) {
    throw createInvalidCredentialsError(["email"], ["password"]);
  }

  return { token: signToken(account) };
};

/**
 * Defines the request and response message body types of authentication router
 * endpoints.
 */
export interface AuthenticationController {
  generateToken: Query<GenerateAuthenticationTokenDto, AuthenticationTokenDto>;
}

/**
 * Router which endpoints manage the authentication.
 */
export const authenticationRouter = new Router();

// Define all authentication controller endpoints.
defineNoAuth(
  authenticationRouter,
  "authentication",
  "generateToken",
  generateAuthenticationTokenDtoValidator,
  generateToken
);
