import { AuthStore } from "./AuthStore";
import { FoodsStore } from "./FoodsStore";
import { ViewsStore } from "./ViewsStore";
import { Food } from "../model/Food";

/**
 * Store that stores all other stores.
 */
export class RootStore {
  public auth: AuthStore;
  public foods: FoodsStore;
  public views: ViewsStore;

  public constructor() {
    this.auth = new AuthStore(this);
    this.foods = new FoodsStore(Food);
    this.views = new ViewsStore(this);
  }

  /**
   * Clears all stores.
   */
  public clear() {
    this.auth.clear();
    this.foods.clear();
  }
}

/**
 * Root store instance.
 */
export const rootStore = new RootStore();
