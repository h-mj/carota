import * as Router from "koa-router";
import { hash, compare } from "bcryptjs";
import { defineNoAuth } from "./utility/routes";
import { Schema, is } from "./middleware/validator";
import { LanguageEnum, Account } from "../entity/Account";
import { Invitation } from "../entity/Invitation";
import {
  createInvalidCredentialsError,
  createIdNotFoundError
} from "./utility/errors";
import { callCatch } from "./utility/queries";
import { signToken } from "./middleware/authenticator";

/**
 * Router, which handles all routes related to authentication.
 */
export const authRouter = new Router();

/**
 * Login request body schema.
 */
const loginSchema: Schema<"/auth/login"> = {
  email: is.string(),
  password: is.string()
};

defineNoAuth(authRouter, "/auth/login", loginSchema, async context => {
  const { email, password } = context.state.body;

  const account = await Account.findOne({ email });

  if (account === undefined || !(await compare(password, account.hash))) {
    throw createInvalidCredentialsError("email", "password");
  }

  context.state.data = { token: signToken(account) };
});

/**
 * Register request body schema.
 */
const registerSchema: Schema<"/auth/register"> = {
  name: is.string(),
  language: is.string().valid(Object.keys(LanguageEnum)),
  email: is.string().email(),
  password: is.string().min(8),
  invitationId: is.string().guid()
};

defineNoAuth(authRouter, "/auth/register", registerSchema, async context => {
  const { name, language, email, password, invitationId } = context.state.body;

  const invitation = await Invitation.findOne({ id: invitationId });

  if (invitation === undefined) {
    throw createIdNotFoundError(invitationId, Invitation.name, "invitationId");
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

  context.state.data = { token: signToken(account) };
});
