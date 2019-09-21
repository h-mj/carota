import { deviate, Success } from "deviator";

import * as Router from "@koa/router";

import { Invitation, InvitationDto } from "../entity/Invitation";
import { createIdNotFoundError } from "../utility/errors";
import { defineNoAuth } from "../utility/routes";
import { Query } from "./";

/**
 * Router which endpoints manage the invitation entities.
 */
export const invitationRouter = new Router();

/**
 * Defines the request and response message body types of invitation router
 * endpoints.
 */
export interface InvitationController {
  get: Query<GetInvitationDto, InvitationDto>;
}

/**
 * Validates get invitation request body.
 */
// prettier-ignore
const getInvitationDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

/**
 * Get invitation request data transfer object type.
 */
type GetInvitationDto = Success<typeof getInvitationDtoValidator>;

defineNoAuth(
  invitationRouter,
  "invitation",
  "get",
  getInvitationDtoValidator,
  async context => {
    const { id } = context.state.body;
    const invitation = await Invitation.findOne({ id });

    if (invitation === undefined) {
      throw createIdNotFoundError(id, Invitation.name, ["id"]);
    }

    context.state.data = invitation.toDto();
  }
);
