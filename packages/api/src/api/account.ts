import * as Router from "@koa/router";
import { compare, hash } from "bcryptjs";
import { deviate } from "deviator";

import { Account, LANGUAGES } from "../entity/Account";
import { Invitation } from "../entity/Invitation";
import { signToken } from "./middleware/authenticator";
import {
  createIdNotFoundError,
  createInvalidCredentialsError
} from "./utility/errors";
import { callCatch } from "./utility/queries";
import { defineNoAuth } from "./utility/routes";

/**
 * Router, which handles all routes related to accounts.
 */
export const accountRouter = new Router();

/**
 * Login request body validator.
 */
// prettier-ignore
const accountLoginValidator =  deviate().object().shape({
  email: deviate().string().trim().lowercase().notEmpty(),
  password: deviate().string().notEmpty()
});

defineNoAuth(
  accountRouter,
  "account",
  "login",
  accountLoginValidator,
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
 * Account register request body validator.
 */
// prettier-ignore
const accountRegisterValidator = deviate().object().shape({
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
  accountRegisterValidator,
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
