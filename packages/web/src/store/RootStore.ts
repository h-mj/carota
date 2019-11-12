import { AccountsStore } from "./AccountsStore";
import { FoodstuffsStore } from "./FoodstuffsStore";
import { InvitationsStore } from "./InvitationsStore";
import { MealsStore } from "./MealsStore";
import { MeasurementsStore } from "./MeasurementsStore";
import { ViewsStore } from "./ViewsStore";

/**
 * Store that stores all other stores.
 */
export class RootStore {
  public accounts: AccountsStore;
  public foodstuffs: FoodstuffsStore;
  public invitations: InvitationsStore;
  public meals: MealsStore;
  public measurements: MeasurementsStore;
  public views: ViewsStore;

  /**
   * Creates the root store and initializes all other stores.
   */
  public constructor() {
    this.accounts = new AccountsStore(this);
    this.foodstuffs = new FoodstuffsStore(this);
    this.invitations = new InvitationsStore();
    this.meals = new MealsStore(this);
    this.measurements = new MeasurementsStore(this);
    this.views = new ViewsStore(this);
  }

  /**
   * Loads all stores.
   */
  public async load() {
    await Promise.all([this.accounts.load()]);
  }

  /**
   * Clears all stores.
   */
  public clear() {
    this.accounts.clear();
    this.foodstuffs.clear();
    this.meals.clear();
    this.measurements.clear();
  }
}

/**
 * Root store instance.
 */
export const rootStore = new RootStore();
