import { EntityRepository, Repository } from "typeorm";

import { ordered } from "../../utility/entities";
import { Account } from "../account/Account";
import { Group } from "./Group";

/**
 * Repository responsible for managing `Group` entities.
 */
@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  /**
   * Returns an array of ordered groups of specified account.
   */
  public async findOrderedOf(account: Account) {
    const groups = ordered(
      await this.find({
        where: { accountId: account, linked: true },
        relations: ["accounts"]
      })
    );

    for (const group of groups) {
      group.accounts = Promise.resolve(ordered(await group.accounts));
    }

    return groups;
  }

  /**
   * Links specified group between `previous` and `next` groups inside group
   * linked list of specified `account`.
   */
  public async link(group: Group, previous?: Group, next?: Group) {
    if (previous !== undefined) {
      await this.createQueryBuilder()
        .update(Group)
        .set({ nextId: group.id })
        .where({ id: previous.id })
        .execute();
    }

    await this.createQueryBuilder()
      .update(Group)
      .set({
        nextId: next !== undefined ? next.id : null,
        linked: true
      })
      .where({ id: group.id })
      .execute();
  }

  /**
   * Unlinks specified group from the group linked list.
   */
  public async unlink(meal: Group) {
    await this.createQueryBuilder()
      .update(Group)
      .set({ nextId: null, linked: false })
      .where({ id: meal.id })
      .execute();

    await this.createQueryBuilder()
      .update(Group)
      .set({ nextId: meal.nextId })
      .where({ nextId: meal.id })
      .execute();
  }
}
