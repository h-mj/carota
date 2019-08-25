import * as Router from "@koa/router";
import { compare, hash } from "bcryptjs";

import { Account, LANGUAGES } from "../entity/Account";
import { Invitation } from "../entity/Invitation";
import { signToken } from "./middleware/authenticator";
import { Schema, is } from "./middleware/validator";
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
 * Login request body schema.
 */
const LOGIN_SCHEMA: Readonly<Schema<"account", "login">> = {
  email: is
    .string()
    .trim()
    .lowercase(),
  password: is.string()
};

defineNoAuth(accountRouter, "account", "login", LOGIN_SCHEMA, async context => {
  const { email, password } = context.state.body;

  const account = await Account.findOne({ email });

  if (account === undefined || !(await compare(password, account.hash))) {
    throw createInvalidCredentialsError(["email"], ["password"]);
  }

  context.state.data = { token: signToken(account) };
});

/**
 * Register request body schema.
 */
const REGISTER_SCHEMA: Readonly<Schema<"account", "register">> = {
  name: is.string().trim(),
  language: is.string().valid(LANGUAGES),
  email: is
    .string()
    .trim()
    .lowercase()
    .email(),
  password: is.string().min(8),
  invitationId: is.string().guid()
};

defineNoAuth(
  accountRouter,
  "account",
  "register",
  REGISTER_SCHEMA,
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
