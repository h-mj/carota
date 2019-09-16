import { deviate } from "deviator";

import * as Router from "@koa/router";

import { Invitation, InvitationData } from "../entity/Invitation";
import { createIdNotFoundError } from "../utility/errors";
import { defineNoAuth } from "../utility/routes";
import { Query } from "./";

/**
 * Router, which handles all routes related to invitations.
 */
export const invitationRouter = new Router();

/**
 * Invitation controller endpoints, their request message body and response
 * message body data types.
 */
export interface InvitationController {
  get: Query<GetBody, InvitationData>;
}

/**
 * Get request message body type.
 */
interface GetBody {
  /**
   * ID of requested invitation.
   */
  id: string;
}

/**
 * Get request body validator.
 */
// prettier-ignore
const getValidator = deviate().object().shape({
  id: deviate().string().guid()
});

defineNoAuth(
  invitationRouter,
  "invitation",
  "get",
  getValidator,
  async context => {
    const { id } = context.state.body;
    const invitation = await Invitation.findOne({ id });

    if (invitation === undefined) {
      throw createIdNotFoundError(id, Invitation.name, ["id"]);
    }

    context.state.data = invitation.toData();
  }
);
