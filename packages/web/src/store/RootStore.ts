import { FoodModel } from "../model/FoodModel";
import { InvitationModel } from "../model/InvitationModel";
import { MealModel } from "../model/MealModel";
import { AccountsStore } from "./AccountsStore";
import { FoodsStore } from "./FoodsStore";
import { InvitationsStore } from "./InvitationsStore";
import { MealsStore } from "./MealsStore";
import { ViewsStore } from "./ViewsStore";

/**
 * Store that stores all other stores.
 */
export class RootStore {
  public accounts: AccountsStore;
  public foods: FoodsStore;
  public invitations: InvitationsStore;
  public meals: MealsStore;
  public views: ViewsStore;

  /**
   * Creates the root store and initializes all other stores.
   */
  public constructor() {
    this.accounts = new AccountsStore(this);
    this.foods = new FoodsStore(FoodModel);
    this.invitations = new InvitationsStore(InvitationModel);
    this.meals = new MealsStore(MealModel);
    this.views = new ViewsStore(this);
  }

  /**
   * Clears all stores.
   */
  public clear() {
    this.accounts.clear();
    this.foods.clear();
    this.invitations.clear();
    this.meals.clear();
  }
}

/**
 * Root store instance.
 */
export const rootStore = new RootStore();
