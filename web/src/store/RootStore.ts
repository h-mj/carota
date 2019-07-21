import { AuthStore } from "./AuthStore";
import { FoodsStore } from "./FoodsStore";
import { InvitationsStore } from "./InvitationsStore";
import { ViewsStore } from "./ViewsStore";
import { Food } from "../model/Food";
import { Invitation } from "../model/Invitation";

/**
 * Store that stores all other stores.
 */
export class RootStore {
  public auth: AuthStore;
  public foods: FoodsStore;
  public invitations: InvitationsStore;
  public views: ViewsStore;

  /**
   * Creates the root store and initializes all other stores.
   */
  public constructor() {
    this.auth = new AuthStore(this);
    this.foods = new FoodsStore(Food);
    this.invitations = new InvitationsStore(Invitation);
    this.views = new ViewsStore(this);
  }

  /**
   * Clears all stores.
   */
  public clear() {
    this.auth.clear();
    this.foods.clear();
    this.invitations.clear();
  }
}

/**
 * Root store instance.
 */
export const rootStore = new RootStore();
