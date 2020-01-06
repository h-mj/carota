import { AccountsStore } from "./AccountsStore";
import { AuthenticationStore } from "./AuthenticationStore";
import { DishesStore } from "./DishesStore";
import { FoodstuffsStore } from "./FoodstuffsStore";
import { GroupsStore } from "./GroupsStore";
import { InvitationsStore } from "./InvitationsStore";
import { MealsStore } from "./MealsStore";
import { MeasurementsStore } from "./MeasurementsStore";
import { StatisticsStore } from "./StatisticsStore";
import { ViewsStore } from "./ViewsStore";

/**
 * Store that stores all other stores.
 */
export class RootStore {
  /**
   * Accounts store instance.
   */
  public readonly accounts: AccountsStore;

  /**
   * Authentication store instance.
   */
  public readonly authentication: AuthenticationStore;

  /**
   * Dishes store instance.
   */
  public readonly dishes: DishesStore;

  /**
   * Foodstuffs store instance.
   */
  public readonly foodstuffs: FoodstuffsStore;

  /**
   * Groups store instance.
   */
  public readonly groups: GroupsStore;

  /**
   * Invitations store instance.
   */
  public readonly invitations: InvitationsStore;

  /**
   * Meals store instance.
   */
  public readonly meals: MealsStore;

  /**
   * Measurements store instance.
   */
  public readonly measurements: MeasurementsStore;

  /**
   * Views store instance.
   */
  public readonly views: ViewsStore;

  /**
   * Statistics store instance.
   */
  public readonly statistics: StatisticsStore;

  /**
   * Creates the root store and initializes all other stores.
   */
  public constructor() {
    this.accounts = new AccountsStore(this);
    this.authentication = new AuthenticationStore(this);
    this.dishes = new DishesStore(this);
    this.foodstuffs = new FoodstuffsStore(this);
    this.groups = new GroupsStore(this);
    this.invitations = new InvitationsStore(this);
    this.meals = new MealsStore(this);
    this.measurements = new MeasurementsStore(this);
    this.views = new ViewsStore(this);
    this.statistics = new StatisticsStore(this);
  }

  /**
   * Initializes all other stores.
   */
  public async initialize() {
    await Promise.all([
      this.accounts.initialize(),
      this.authentication.initialize(),
      this.dishes.initialize(),
      this.foodstuffs.initialize(),
      this.groups.initialize(),
      this.invitations.initialize(),
      this.meals.initialize(),
      this.measurements.initialize(),
      this.views.initialize(),
      this.statistics.clear()
    ]);
  }

  /**
   * Clears all stores.
   */
  public clear() {
    this.accounts.clear();
    this.authentication.clear();
    this.dishes.clear();
    this.foodstuffs.clear();
    this.groups.clear();
    this.invitations.clear();
    this.meals.clear();
    this.measurements.clear();
    this.views.clear();
    this.statistics.clear();
  }
}

/**
 * Global root store instance.
 */
export const rootStore = new RootStore();
