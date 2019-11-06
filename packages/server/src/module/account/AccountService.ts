import { hash } from "bcryptjs";
import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../base/error/InvalidIdError";
import { UniqueConstraintError } from "../../base/error/UniqueConstraintErrors";
import { Invitation } from "../invitation/Invitation";
import { InvitationRepository } from "../invitation/InvitationRepository";
import { Account } from "./Account";
import { AccountRepository } from "./AccountRepository";
import { CreateAccountDto } from "./dto/CreateAccountDto";
import { GetAccountDto } from "./dto/GetAccountDto";
import { SetAccountLanguageDto } from "./dto/SetAccountLanguageDto";

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

    if (
      (await accountRepository!.findOne({ email: dto.email })) !== undefined
    ) {
      throw new UniqueConstraintError(["email"]);
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

  @Transaction()
  public async get(
    dto: GetAccountDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository
  ) {
    const account = await accountRepository!.findOne(dto.id || principal.id);

    if (account === undefined) {
      throw new InvalidIdError(Account, ["id"]);
    }

    return account;
  }

  @Transaction()
  public async setLanguage(
    dto: SetAccountLanguageDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository
  ) {
    principal.language = dto.language;

    await accountRepository!.save(principal);
  }
}
