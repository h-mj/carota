import { Food } from "../model/Food";
import { Invitation } from "../model/Invitation";
import { AccountsStore } from "./AccountsStore";
import { FoodsStore } from "./FoodsStore";
import { InvitationsStore } from "./InvitationsStore";
import { ViewsStore } from "./ViewsStore";

/**
 * Store that stores all other stores.
 */
export class RootStore {
  public accounts: AccountsStore;
  public foods: FoodsStore;
  public invitations: InvitationsStore;
  public views: ViewsStore;

  /**
   * Creates the root store and initializes all other stores.
   */
  public constructor() {
    this.accounts = new AccountsStore(this);
    this.foods = new FoodsStore(Food);
    this.invitations = new InvitationsStore(Invitation);
    this.views = new ViewsStore(this);
  }

  /**
   * Clears all stores.
   */
  public clear() {
    this.accounts.clear();
    this.foods.clear();
    this.invitations.clear();
  }
}

/**
 * Root store instance.
 */
export const rootStore = new RootStore();
