import { EntityRepository, Repository } from "typeorm";

import { ordered } from "../../utility/entities";
import { Group } from "../group/Group";
import { Account } from "./Account";

/**
 * Repository responsible for managing `Account` entities.
 */
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  /**
   * Returns an ordered array of accounts of specified group.
   */
  public async findOfGroup(group: Group) {
    return ordered(
      await this.find({ where: { groupId: group, linked: true } })
    );
  }

  /**
   * Links specified `account` between `previous` and `next` account inside
   * group accounts linked list of specified `group`.
   */
  public async link(
    account: Account,
    group: Group,
    previous?: Account,
    next?: Account
  ) {
    if (previous !== undefined) {
      await this.createQueryBuilder()
        .update(Account)
        .set({ nextId: account.id })
        .where({ id: previous.id })
        .execute();
    }

    await this.createQueryBuilder()
      .update(Account)
      .set({
        groupId: group.id,
        nextId: next !== undefined ? next.id : null,
        linked: true,
      })
      .where({ id: account.id })
      .execute();
  }

  /**
   * Unlinks specified account from the group accounts linked list.
   */
  public async unlink(account: Account) {
    await this.createQueryBuilder()
      .update(Account)
      .set({ groupId: null, nextId: null, linked: false })
      .where({ id: account.id })
      .execute();

    await this.createQueryBuilder()
      .update(Account)
      .set({ nextId: account.nextId })
      .where({ nextId: account.id })
      .execute();
  }
}
