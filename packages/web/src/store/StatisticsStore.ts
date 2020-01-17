import { Data } from "server";

import { Account } from "../model/Account";
import { Rpc } from "../utility/rpc";
import { Store } from "./Store";

/**
 * Statistics managing store.
 */
export class StatisticsStore extends Store {
  /**
   * Maps account identifiers to received statistical data.
   */
  private cache: Map<string, Data<"statistics", "getAll">> = new Map();

  /**
   * Clears this store.
   */
  public clear() {
    this.cache.clear();
  }

  /**
   * Returns statistics data of specified `account`.
   */
  public async load(account: Account) {
    const data = this.cache.get(account.id);

    if (data !== undefined) {
      return data;
    }

    const response = await Rpc.call("statistics", "getAll", {
      accountId: account.id
    });

    if (!response.ok) {
      this.rootStore.viewStore.notifyUnknownError();
      return undefined;
    }

    this.cache.set(account.id, response.value);

    return response.value;
  }
}
