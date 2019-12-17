import { Dish } from "../model/Dish";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { Rpc } from "../utility/rpc";
import { RootStore } from "./RootStore";

/**
 * Dish managing store.
 */
export class DishesStore {
  /**
   * RootStore instance.
   */
  public readonly rootStore: RootStore;

  /**
   * Creates a new instance of `DishesStore`.
   */
  public constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Creates a new `Dish` within specified `meal`. Created dish will specify
   * that user consumed specified `quantity` of specified `foodstuff`.
   */
  public async create(
    meal: Meal,
    foodstuff: Foodstuff,
    quantity: number,
    eaten: boolean
  ) {
    const result = await Rpc.call("dish", "create", {
      mealId: meal.id,
      foodstuffId: foodstuff.id,
      quantity,
      eaten
    });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }

    meal.dishes.push(new Dish(result.value, meal, this));
  }

  /**
   * Deletes specified dish.
   */
  public async delete(dish: Dish) {
    dish.meal.dishes.splice(dish.meal.dishes.indexOf(dish), 1);

    const result = await Rpc.call("dish", "delete", { id: dish.id });

    if (!result.ok) {
      this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Moves specified dish to specified meal at specified index.
   */
  public async insert(dish: Dish, meal: Meal, index: number) {
    dish.meal.dishes.splice(dish.meal.dishes.indexOf(dish), 1);

    meal.dishes.splice(index, 0, dish);
    dish.meal = meal;

    // Make the reorder dish request so that order is updated on the server too.
    const result = await Rpc.call("dish", "insert", {
      id: dish.id,
      mealId: meal.id,
      index
    });

    if (!result.ok) {
      this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Sets whether specified dish is eaten.
   */
  public async setEaten(dish: Dish, eaten: boolean) {
    dish.eaten = eaten;

    const result = await Rpc.call("dish", "setEaten", { id: dish.id, eaten });

    if (!result.ok) {
      this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Sets the quantity of specified dish.
   */
  public async setQuantity(dish: Dish, quantity: number) {
    dish.quantity = quantity;

    const result = await Rpc.call("dish", "setQuantity", {
      id: dish.id,
      quantity
    });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }
  }
}
