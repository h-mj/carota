import { Dish } from "../model/Dish";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { Rpc } from "../utility/rpc";
import { CachedStore } from "./CachedStore";

/**
 * Dish managing store.
 */
export class DishStore extends CachedStore<Dish> {
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
      eaten,
    });

    if (!result.ok) {
      return result.value;
    }

    meal.dishes.push(new Dish(result.value, meal, this));

    return;
  }

  /**
   * Deletes specified dish.
   */
  public async delete(dish: Dish) {
    const result = await Rpc.call("dish", "delete", { id: dish.id });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
    }

    dish.meal.dishes.splice(dish.meal.dishes.indexOf(dish), 1);
    this.unregister(dish);
  }

  /**
   * Moves specified dish to specified meal at specified index.
   */
  public async insert(dish: Dish, meal: Meal, index: number) {
    const { dishes } = dish.meal;
    dishes.splice(dishes.indexOf(dish), 1);

    meal.dishes.splice(index, 0, dish);
    dish.meal = meal;

    const result = await Rpc.call("dish", "insert", {
      id: dish.id,
      mealId: meal.id,
      index,
    });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
    }
  }

  /**
   * Sets whether specified dish is eaten.
   */
  public async setEaten(dish: Dish, eaten: boolean) {
    dish.eaten = eaten;

    const result = await Rpc.call("dish", "setEaten", { id: dish.id, eaten });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
    }
  }

  /**
   * Sets the quantity of specified dish.
   */
  public async setQuantity(dish: Dish, quantity: number) {
    const result = await Rpc.call("dish", "setQuantity", {
      id: dish.id,
      quantity,
    });

    if (!result.ok) {
      return result.value;
    }

    dish.quantity = quantity;

    return;
  }
}
