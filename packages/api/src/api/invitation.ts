import * as Router from "@koa/router";
import { deviate } from "deviator";

import { Invitation } from "../entity/Invitation";
import { createIdNotFoundError } from "../utility/errors";
import { defineNoAuth } from "../utility/routes";

/**
 * Router, which handles all routes related to invitations.
 */
export const invitationRouter = new Router();

/**
 * Invitation get request body validator.
 */
// prettier-ignore
const invitationGetValidator = deviate().object().shape({
  id: deviate().string().guid()
});

defineNoAuth(
  invitationRouter,
  "invitation",
  "get",
  invitationGetValidator,
  async context => {
    const { id } = context.state.body;
    const invitation = await Invitation.findOne({ id });

    if (invitation === undefined) {
      throw createIdNotFoundError(id, Invitation.name, ["id"]);
    }

    context.state.data = invitation.toData();
  }
);
