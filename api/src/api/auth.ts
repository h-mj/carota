import * as Router from "koa-router";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { define } from "./utility/routes";
import { Schema, is } from "./middleware/validator";
import { LanguageEnum, Account } from "../entity/Account";
import { Invitation } from "../entity/Invitation";
import {
  createInvalidCredentialsError,
  createIdNotFoundError
} from "./utility/errors";
import { callCatch } from "./utility/queries";

/**
 * Type of payload in JWT.
 */
interface Payload {
  id: string;
}

/**
 * Creates a payload from a given account.
 *
 * @param account Account from which payload is created.
 */
const createPayload = (account: Account): Payload => {
  return { id: account.id };
};

/**
 * Signs a payload generated based on a given account using `SECRET` environment
 * variable.
 *
 * @param account Account from which payload is created.
 */
const signToken = (account: Account) => {
  return sign(createPayload(account), process.env.SECRET!);
};

/**
 * Router, which handles all routes related to authentication.
 */
export const auth = new Router();

/**
 * Login request body schema.
 */
const loginSchema: Schema<"/auth/login"> = {
  email: is.string(),
  password: is.string()
};

define(auth, "/auth/login", loginSchema, async context => {
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

define(auth, "/auth/register", registerSchema, async context => {
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
