import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account, authorize as authorizeAccount } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";
import { CreateGroupDto } from "./dto/CreateGroupDto";
import { GetGroupsDto } from "./dto/GetGroupsDto";
import { GroupRepository } from "./GroupRepository";

/**
 * Group entity management service.
 */
@Injectable()
export class GroupService {
  /**
   * Creates a new group for specified `principal` account based on specified
   * data transfer object.
   */
  @Transaction()
  public async create(
    dto: CreateGroupDto,
    principal: Account,
    @TransactionRepository() groupRepository?: GroupRepository
  ) {
    const previous = await groupRepository!.findOne({
      where: { accountId: principal.id, linked: true, nextId: null }
    });

    const group = await groupRepository!.save(
      groupRepository!.create({
        name: dto.name,
        accountId: principal.id,
        linked: false
      })
    );

    await groupRepository!.link(group, previous);

    return group;
  }

  /**
   * Returns an array of ordered advisee groups of account specified by given
   * data transfer object.
   */
  @Transaction()
  public async get(
    dto: GetGroupsDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository,
    @TransactionRepository() groupRepository?: GroupRepository
  ) {
    const account = await accountRepository!.findOne(dto.accountId);

    if (account === undefined) {
      throw new InvalidIdError(Account, ["accountId"]);
    }

    await authorizeAccount(principal, "get groups of", account);

    return {
      ungrouped: await accountRepository!.find({
        where: { adviser: account.id, groupId: null }
      }),
      groups: await groupRepository!.findOrderedOf(account)
    };
  }
}
