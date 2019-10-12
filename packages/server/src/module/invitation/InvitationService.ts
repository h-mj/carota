import { Transaction, TransactionRepository } from "typeorm";

import { BadRequestException, Injectable } from "@nestjs/common";

import { InvitationRepository } from "./InvitationRepository";

@Injectable()
export class InvitationService {
  @Transaction()
  public async get(
    id: string,
    @TransactionRepository() invitationRepository?: InvitationRepository
  ) {
    const invitation = invitationRepository!.findOne(id);

    if (invitation === undefined) {
      throw new BadRequestException();
    }

    return invitation;
  }
}
