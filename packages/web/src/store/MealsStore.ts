import { action, observable } from "mobx";

import { Dish } from "../model/Dish";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { Rpc } from "../utility/rpc";

/**
 * Converts specified date to `YYYY-MM-DD` formatted string that ignores current
 * timezone.
 */
const toDateString = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/**
 * Store which manages `Meal` models.
 */
export class MealsStore {
  /**
   * Stored meal models.
   */
  @observable public meals: Meal[] = [];

  /**
   * Returns meal model with specified ID.
   */
  public withId(id: string) {
    return this.meals.find(meal => meal.id === id);
  }

  /**
   * Returns whether meal with specified name exists.
   */
  public hasWithName(name: string) {
    return this.meals.find(meal => meal.name === name) !== undefined;
  }

  /**
   * Clears all stored data.
   */
  @action
  public clear() {
    this.meals = [];
  }

  /**
   * Creates a new meal with specified `name` and `date`.
   */
  @action
  public async create(name: string, date: Date) {
    const result = await Rpc.call("meal", "create", {
      name,
      date: toDateString(date)
    });

    if (!result.ok) {
      return result.value;
    }

    this.meals.push(new Meal(result.value, this));

    return undefined;
  }

  /**
   * Sets `quantity` of consumed `foodstuff` during specified `meal`.
   */
  @action
  public async consume(meal: Meal, foodstuff: Foodstuff, quantity: number) {
    const result = await Rpc.call("dish", "create", {
      mealId: meal.id,
      foodstuffId: foodstuff.id,
      quantity
    });

    if (!result.ok) {
      return result.value;
    }

    meal.dishes.push(new Dish(result.value, meal));

    return undefined;
  }

  /**
   * Replaces currently stored meal models with meals with specified `date`.
   */
  @action
  public async getAll(date: Date) {
    this.clear();

    const result = await Rpc.call("meal", "getAll", {
      accountId: undefined,
      date: toDateString(date)
    });

    if (!result.ok) {
      return result.value;
    }

    this.meals = result.value.map(dto => new Meal(dto, this));

    return undefined;
  }

  /**
   * Moves specified `meal` to specified `index`.
   */
  @action
  public async insert(meal: Meal, index: number) {
    this.meals.splice(this.meals.indexOf(meal), 1);
    this.meals.splice(index, 0, meal);

    const result = await Rpc.call("meal", "insert", {
      id: meal.id,
      date: meal.date,
      index
    });

    if (!result.ok) {
      return result.value;
    }

    return undefined;
  }

  /**
   * Moves specified dish to specified meal at specified index.
   */
  @action
  public async reorder(dish: Dish, meal: Meal, index: number) {
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
      return result.value;
    }

    return undefined;
  }

  /**
   * Deletes specified `meal`.
   */
  @action
  public async delete(meal: Meal) {
    if (meal.dishes.length > 0) {
      throw new Error("Tried to remove non-empty meal");
    }

    this.meals.splice(this.meals.indexOf(meal), 1);

    const result = await Rpc.call("meal", "delete", { id: meal.id });

    if (!result.ok) {
      return result.value;
    }

    return undefined;
  }

  /**
   * Renames specified meal to specified name.
   */
  @action
  public async rename(meal: Meal, name: string) {
    meal.name = name;

    const result = await Rpc.call("meal", "rename", { id: meal.id, name });

    if (!result.ok) {
      return result.value;
    }

    return;
  }

  /**
   * Unconsumed specified `dish`.
   */
  @action
  public async unconsume(dish: Dish) {
    dish.meal.dishes.splice(dish.meal.dishes.indexOf(dish), 1);

    const result = await Rpc.call("dish", "delete", { id: dish.id });

    if (!result.ok) {
      return result.value;
    }

    return undefined;
  }
}
