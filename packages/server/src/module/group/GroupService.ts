import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { BadRequestError } from "../../base/error/BadRequestError";
import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account, authorize as authorizeAccount } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";
import { CreateGroupDto } from "./dto/CreateGroupDto";
import { DeleteGroupDto } from "./dto/DeleteGroupDto";
import { GetGroupsDto } from "./dto/GetGroupsDto";
import { InsertGroupDto } from "./dto/InsertGroupDto";
import { RenameGroupDto } from "./dto/RenameGroupDto";
import { authorize as authorizeGroup, Group } from "./Group";
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
      where: { accountId: principal.id, linked: true, nextId: null },
    });

    const group = await groupRepository!.save(
      groupRepository!.create({
        name: dto.name,
        accountId: principal.id,
        linked: false,
      })
    );

    await groupRepository!.link(group, previous);

    return group;
  }

  /**
   * Deletes a group with given identifier.
   */
  @Transaction()
  public async delete(
    dto: DeleteGroupDto,
    principal: Account,
    @TransactionRepository() groupRepository?: GroupRepository
  ) {
    const group = await groupRepository!.findOne(dto.id);

    if (group === undefined) {
      throw new InvalidIdError(Group, ["id"]);
    }

    await authorizeGroup(principal, "delete", group);

    await groupRepository!.unlink(group);
    await groupRepository!.remove(group);
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
        where: { adviserId: account.id, groupId: null },
      }),
      groups: await groupRepository!.findOrderedOf(account),
    };
  }

  /**
   * Inserts specified group at specified index within adviser advisee group
   * list.
   */
  @Transaction()
  public async insert(
    dto: InsertGroupDto,
    principal: Account,
    @TransactionRepository() groupRepository?: GroupRepository
  ) {
    const group = await groupRepository!.findOne(dto.id);

    if (group === undefined) {
      throw new InvalidIdError(Group, ["id"]);
    }

    await authorizeGroup(principal, "insert", group);

    await groupRepository!.unlink(group);

    const groups = await groupRepository!.findOrderedOf(principal);

    if (!(dto.index in groups) && dto.index !== groups.length) {
      throw new BadRequestError("Provided insertion index is out of bounds.", {
        location: { part: "body", path: ["index"] },
        reason: "invalidIndex",
      });
    }

    await groupRepository!.link(
      group,
      groups[dto.index - 1],
      groups[dto.index]
    );
  }

  /**
   * Renames group with specified id to specified name.
   */
  @Transaction()
  public async rename(
    dto: RenameGroupDto,
    principal: Account,
    @TransactionRepository() groupRepository?: GroupRepository
  ) {
    const group = await groupRepository!.findOne(dto.id);

    if (group === undefined) {
      throw new InvalidIdError(Group, ["id"]);
    }

    await authorizeGroup(principal, "rename", group);

    group.name = dto.name;
    groupRepository!.save(group);
  }
}
