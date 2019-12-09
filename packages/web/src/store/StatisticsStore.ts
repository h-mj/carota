import { Rpc } from "../utility/rpc";
import { RootStore } from "./RootStore";

/**
 * Store responsible for requesting statistical data.
 */
export class StatisticsStore {
  /**
   * Root store reference.
   */
  private readonly rootStore: RootStore;

  /**
   * Creates a new instance of `StatisticsStore`.
   */
  public constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

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
