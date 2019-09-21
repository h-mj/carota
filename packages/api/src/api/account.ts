import { hash } from "bcryptjs";
import { deviate, Success } from "deviator";

import * as Router from "@koa/router";

import { Account, LANGUAGES } from "../entity/Account";
import { Invitation } from "../entity/Invitation";
import { generateToken } from "../middleware/authenticator";
import { createIdNotFoundError } from "../utility/errors";
import { callCatch } from "../utility/queries";
import { defineNoAuth } from "../utility/routes";
import { Query } from "./";
import { AuthenticationTokenDto } from "./authentication";

/**
 * Router which endpoints manage the account entities.
 */
export const accountRouter = new Router();

/**
 * Defines the request and response message body types of account router
 * endpoints.
 */
export interface AccountController {
  create: Query<CreateAccountDto, AuthenticationTokenDto>;
}

/**
 * Validates create account request body.
 */
// prettier-ignore
const createAccountDtoValidator = deviate().object().shape({
  name: deviate().string().trim().notEmpty(),
  language: deviate().string().options(LANGUAGES),
  email: deviate().string().trim().lowercase().email(),
  password: deviate().string().notEmpty(),
  invitationId: deviate().string().guid()
});

/**
 * Create account request data transfer object type.
 */
type CreateAccountDto = Success<typeof createAccountDtoValidator>;

defineNoAuth(
  accountRouter,
  "account",
  "create",
  createAccountDtoValidator,
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

    context.state.data = { token: generateToken(account) };
  }
);
