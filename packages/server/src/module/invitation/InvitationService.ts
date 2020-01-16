import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { ForbiddenError } from "../../base/error/ForbiddenError";
import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account } from "../account/Account";
import { GetInvitationDto } from "./dto/GetInvitationDto";
import { Invitation } from "./Invitation";
import { InvitationRepository } from "./InvitationRepository";

/**
 * Invitation entity management service.
 */
@Injectable()
export class InvitationService {
  /**
   * Creates an invitation for new advisee of principal account.
   */
  @Transaction()
  public async createForAdvisee(
    principal: Account,
    @TransactionRepository() invitationRepository?: InvitationRepository
  ) {
    if (principal.type !== "Adviser") {
      throw new ForbiddenError("Account must be an adviser.");
    }

    const invitation = invitationRepository!.create({
      type: "Default",
      rights: "Default",
      adviserId: principal.id,
      inviterId: principal.id
    });

    return invitationRepository!.save(invitation);
  }

  /**
   * Returns invitation with specified identifier.
   */
  @Transaction()
  public async get(
    dto: GetInvitationDto,
    @TransactionRepository() invitationRepository?: InvitationRepository
  ) {
    const invitation = await invitationRepository!.findOne(dto.id);

    if (invitation === undefined) {
      throw new InvalidIdError(Invitation, ["id"]);
    }

    return invitation;
  }
}
