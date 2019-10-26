import { action, observable } from "mobx";

import { Dish } from "../model/Dish";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { Rpc } from "../utility/rpc";
import { RootStore } from "./RootStore";

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
   * Root store instance.
   */
  private rootStore: RootStore;

  /**
   * Assigns the root store instance.
   */
  public constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

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
      return this.rootStore.views.notifyUnknownError();
    }

    this.meals.push(new Meal(result.value, this));
  }

  /**
   * Creates a dish part of specified `meal` with given `quantity` of given `foodstuff`.
   */
  @action
  public async createDish(
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

    meal.dishes.push(new Dish(result.value, meal));
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
      return this.rootStore.views.notifyUnknownError();
    }

    this.meals = result.value.map(dto => new Meal(dto, this));
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
      return this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Moves specified dish to specified meal at specified index.
   */
  @action
  public async insertDish(dish: Dish, meal: Meal, index: number) {
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
      return this.rootStore.views.notifyUnknownError();
    }
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
      return this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Unconsumed specified `dish`.
   */
  @action
  public async deleteDish(dish: Dish) {
    dish.meal.dishes.splice(dish.meal.dishes.indexOf(dish), 1);

    const result = await Rpc.call("dish", "delete", { id: dish.id });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Renames specified meal to specified name.
   */
  @action
  public async rename(meal: Meal, name: string) {
    meal.name = name;

    const result = await Rpc.call("meal", "rename", { id: meal.id, name });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Sets whether specified `dish` is `eaten`.
   */
  @action
  public async setDishEaten(dish: Dish, eaten: boolean) {
    dish.eaten = eaten;

    const result = await Rpc.call("dish", "eat", { id: dish.id, eaten });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }
  }
}
