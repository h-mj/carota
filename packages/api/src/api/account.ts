import { compare, hash } from "bcryptjs";
import { deviate } from "deviator";

import * as Router from "@koa/router";

import { Account, LANGUAGES, Languages } from "../entity/Account";
import { Invitation } from "../entity/Invitation";
import { signToken } from "../middleware/authenticator";
import {
  createIdNotFoundError,
  createInvalidCredentialsError
} from "../utility/errors";
import { callCatch } from "../utility/queries";
import { defineNoAuth } from "../utility/routes";
import { Query } from "./";

/**
 * Router, which handles all routes related to accounts.
 */
export const accountRouter = new Router();

/**
 * Account controller endpoints and their request message body and response
 * message body data types.
 */
export interface AccountController {
  login: Query<LoginBody, TokenData>;
  register: Query<RegisterBody, TokenData>;
}

/**
 * Login request message body type.
 */
export interface LoginBody {
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
 * Generated JSON Web Token data type.
 */
export interface TokenData {
  /**
   * Generated JSON Web Token.
   */
  token: string;
}

/**
 * Login request body validator.
 */
// prettier-ignore
const loginValidator =  deviate().object().shape({
  email: deviate().string().trim().lowercase().notEmpty(),
  password: deviate().string().notEmpty()
});

defineNoAuth(
  accountRouter,
  "account",
  "login",
  loginValidator,
  async context => {
    const { email, password } = context.state.body;

    const account = await Account.findOne({ email });

    if (account === undefined || !(await compare(password, account.hash))) {
      throw createInvalidCredentialsError(["email"], ["password"]);
    }

    context.state.data = { token: signToken(account) };
  }
);

/**
 * Register request message body type.
 */
export interface RegisterBody {
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
 * Account register request body validator.
 */
// prettier-ignore
const registerValidator = deviate().object().shape({
  name: deviate().string().trim().notEmpty(),
  language: deviate().string().options(LANGUAGES),
  email: deviate().string().trim().lowercase().email(),
  password: deviate().string().notEmpty(),
  invitationId: deviate().string().guid()
});

defineNoAuth(
  accountRouter,
  "account",
  "register",
  registerValidator,
  async context => {
    const {
      name,
      language,
      email,
      password,
      invitationId
    } = context.state.body;

    const invitation = await Invitation.findOne({ id: invitationId });

    if (invitation === undefined) {
      throw createIdNotFoundError(invitationId, Invitation.name, [
        "invitationId"
      ]);
    }

    const { adviser, inviter, type, rights } = invitation;

    const template = Account.create({
      name,
      language,
      email,
      hash: await hash(password, 12),
      adviser,
      inviter,
      type,
      rights
    });

    const account = await callCatch(() => template.save());

    await invitation.remove();

    context.state.data = { token: signToken(account) };
  }
);
