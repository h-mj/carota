import { AccountStore } from "./AccountStore";
import { AuthenticationStore } from "./AuthenticationStore";
import { DishStore } from "./DishStore";
import { FoodstuffStore } from "./FoodstuffStore";
import { GroupStore } from "./GroupStore";
import { InvitationStore } from "./InvitationStore";
import { MealStore } from "./MealStore";
import { MeasurementStore } from "./MeasurementStore";
import { StatisticsStore } from "./StatisticsStore";
import { ViewStore } from "./ViewStore";

/**
 * Store that stores all other stores.
 */
export class RootStore {
  /**
   * Account store instance.
   */
  public readonly accountStore: AccountStore;

  /**
   * Authentication store instance.
   */
  public readonly authenticationStore: AuthenticationStore;

  /**
   * Dish store instance.
   */
  public readonly dishStore: DishStore;

  /**
   * Foodstuff store instance.
   */
  public readonly foodstuffStore: FoodstuffStore;

  /**
   * Group store instance.
   */
  public readonly groupStore: GroupStore;

  /**
   * Invitation store instance.
   */
  public readonly invitationStore: InvitationStore;

  /**
   * Meal store instance.
   */
  public readonly mealStore: MealStore;

  /**
   * Measurement store instance.
   */
  public readonly measurementStore: MeasurementStore;

  /**
   * View store instance.
   */
  public readonly viewStore: ViewStore;

  /**
   * Statistics store instance.
   */
  public readonly statisticsStore: StatisticsStore;

  /**
   * Creates the root store and initializes all other stores.
   */
  public constructor() {
    this.accountStore = new AccountStore(this);
    this.authenticationStore = new AuthenticationStore(this);
    this.dishStore = new DishStore(this);
    this.foodstuffStore = new FoodstuffStore(this);
    this.groupStore = new GroupStore(this);
    this.invitationStore = new InvitationStore(this);
    this.mealStore = new MealStore(this);
    this.measurementStore = new MeasurementStore(this);
    this.viewStore = new ViewStore(this);
    this.statisticsStore = new StatisticsStore(this);
  }

  /**
   * Initializes all other stores.
   */
  public async initialize() {
    await Promise.all([
      this.accountStore.initialize(),
      this.authenticationStore.initialize(),
      this.dishStore.initialize(),
      this.foodstuffStore.initialize(),
      this.groupStore.initialize(),
      this.invitationStore.initialize(),
      this.mealStore.initialize(),
      this.measurementStore.initialize(),
      this.viewStore.initialize(),
      this.statisticsStore.clear(),
    ]);
  }

  /**
   * Clears all stores.
   */
  public clear() {
    this.accountStore.clear();
    this.authenticationStore.clear();
    this.dishStore.clear();
    this.foodstuffStore.clear();
    this.groupStore.clear();
    this.invitationStore.clear();
    this.mealStore.clear();
    this.measurementStore.clear();
    this.viewStore.clear();
    this.statisticsStore.clear();
  }
}

/**
 * Global root store instance.
 */
export const rootStore = new RootStore();
