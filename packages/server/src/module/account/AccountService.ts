import { hash } from "bcryptjs";
import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { BadRequestError } from "../../base/error/BadRequestError";
import { InvalidIdError } from "../../base/error/InvalidIdError";
import { UniqueConstraintError } from "../../base/error/UniqueConstraintErrors";
import { Group } from "../group/Group";
import { GroupRepository } from "../group/GroupRepository";
import { Invitation } from "../invitation/Invitation";
import { InvitationRepository } from "../invitation/InvitationRepository";
import { Account, authorize } from "./Account";
import { AccountRepository } from "./AccountRepository";
import { CreateAccountDto } from "./dto/CreateAccountDto";
import { GetAccountDto } from "./dto/GetAccountDto";
import { InsertAccountDto } from "./dto/InsertAccountDto";
import { SetAccountLanguageDto } from "./dto/SetAccountLanguageDto";

/**
 * Account entity management service.
 */
@Injectable()
export class AccountService {
  /**
   * Creates a new account with specified fields.
   */
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
      adviserId: invitation.adviserId,
      linked: false,
      inviterId: invitation.inviterId
    });

    await invitationRepository!.remove(invitation);

    return accountRepository!.save(template);
  }

  /**
   * Returns an account with specified identifier.
   */
  @Transaction()
  public async get(
    dto: GetAccountDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository
  ) {
    const account = await accountRepository!.findOne(dto.id);

    if (account === undefined) {
      throw new InvalidIdError(Account, ["id"]);
    }

    await authorize(principal, "get", account);

    return account;
  }

  /**
   * Inserts a specified account into a specified group at given index.
   */
  @Transaction()
  public async insert(
    dto: InsertAccountDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository,
    @TransactionRepository() groupRepository?: GroupRepository
  ) {
    const account = await accountRepository!.findOne(dto.id);

    if (account === undefined) {
      throw new InvalidIdError(Account, ["id"]);
    }

    await authorize(principal, "insert into group", account);

    const group = await groupRepository!.findOne(dto.groupId);

    if (group === undefined) {
      throw new InvalidIdError(Group, ["groupId"]);
    }

    if (account.adviserId !== group.accountId) {
      throw new BadRequestError(
        "Account can only be inserted into a group owned by account adviser."
      );
    }

    await accountRepository!.unlink(account);

    const accounts = await accountRepository!.findOfGroup(group);

    if (!(dto.index in accounts) && dto.index !== accounts.length) {
      throw new BadRequestError("Provided insertion index is out of bounds.", {
        location: { part: "body", path: ["index"] },
        reason: "invalidIndex"
      });
    }

    const previous = accounts[dto.index - 1];
    const next = accounts[dto.index];

    await accountRepository!.link(account, group, previous, next);
  }

  /**
   * Sets display language of current account to specified language.
   */
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
