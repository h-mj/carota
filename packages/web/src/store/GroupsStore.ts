import { Account } from "../model/Account";
import { Group } from "../model/Group";
import { Rpc } from "../utility/rpc";
import { Store } from "./Store";

/**
 * Group managing store.
 */
export class GroupsStore extends Store {
  /**
   * Returns advisee account groups for specified account.
   */
  public async get(account: Account) {
    const result = await Rpc.call("group", "get", { accountId: account.id });

    if (!result.ok) {
      this.rootStore.views.notifyUnknownError();

      return {
        ungrouped: [],
        groups: []
      };
    }

    const { ungrouped, groups } = result.value;

    return {
      ungrouped: ungrouped.map(
        dto => new Account(dto, this.rootStore.accounts)
      ),
      groups: groups.map(dto => new Group(dto, this.rootStore.groups))
    };
  }
}
