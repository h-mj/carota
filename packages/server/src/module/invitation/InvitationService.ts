import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../base/error/InvalidIdError";
import { GetInvitationDto } from "./dto/GetInvitationDto";
import { Invitation } from "./Invitation";
import { InvitationRepository } from "./InvitationRepository";

@Injectable()
export class InvitationService {
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
