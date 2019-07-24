import * as Router from "@koa/router";
import { is, Schema } from "./middleware/validator";
import { Invitation } from "../entity/Invitation";
import { createIdNotFoundError } from "./utility/errors";
import { defineNoAuth } from "./utility/routes";

/**
 * Router, which handles all routes related to invitations.
 */
export const invitationRouter = new Router();

/**
 * Invitation get request body schema.
 */
const INVITATION_GET_SCHEMA: Readonly<Schema<"invitation", "get">> = {
  id: is.string().guid()
};

defineNoAuth(
  invitationRouter,
  "invitation",
  "get",
  INVITATION_GET_SCHEMA,
  async context => {
    const { id } = context.state.body;
    const invitation = await Invitation.findOne({ id });

    if (invitation === undefined) {
      throw createIdNotFoundError(id, Invitation.name, ["id"]);
    }

    context.state.data = invitation.toData();
  }
);
