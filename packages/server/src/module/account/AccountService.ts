import { hash } from "bcryptjs";
import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../error/InvalidIdError";
import { Invitation } from "../invitation/Invitation";
import { InvitationRepository } from "../invitation/InvitationRepository";
import { AccountRepository } from "./AccountRepository";
import { CreateAccountDto } from "./dto/CreateAccountDto";

@Injectable()
export class AccountService {
  @Transaction()
  public async create(
    dto: CreateAccountDto,
    @TransactionRepository() accountRepository?: AccountRepository,
    @TransactionRepository() invitationRepository?: InvitationRepository
  ) {
    const invitation = await invitationRepository!.findOne(dto.invitationId);

    if (invitation === undefined) {
      throw new InvalidIdError(Invitation, ["invitationId"]);
    }

    const template = accountRepository!.create({
      name: dto.name,
      sex: dto.sex,
      birthDate: dto.birthDate,
      language: dto.language,
      email: dto.email,
      hash: await hash(dto.password, 12),
      type: invitation.type,
      rights: invitation.rights,
      adviser: invitation.adviser,
      inviter: invitation.inviter
    });

    await invitationRepository!.remove(invitation);

    return accountRepository!.save(template);
  }
}
