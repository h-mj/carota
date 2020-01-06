import { Rpc } from "../utility/rpc";
import { Store } from "./Store";

/**
 * Statistics managing store.
 */
export class StatisticsStore extends Store {
  /**
   * Returns statistics data for the whole period.
   */
  public async getAll() {
    const response = await Rpc.call("statistics", "getAll", {
      accountId: undefined
    });

    if (!response.ok) {
      this.rootStore.views.notifyUnknownError();
      return undefined;
    }

    return response.value;
  }
}
