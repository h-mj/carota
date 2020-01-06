import { RootStore } from "./RootStore";

/**
 * Abstract store class.
 */
export abstract class Store {
  /**
   * Root store instance.
   */
  public readonly rootStore: RootStore;

  /**
   * Creates a new instance of `Store` with specified `rootStore` instance.
   */
  public constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Initializes this store.
   */
  public async initialize() {
    // Do nothing.
  }

  /**
   * Disposes of all currently stored data.
   */
  public clear() {
    // Do nothing.
  }
}
