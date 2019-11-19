import { action, observable } from "mobx";

import { Dish } from "../model/Dish";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { toIsoDateString } from "../utility/form";
import { Rpc } from "../utility/rpc";
import { RootStore } from "./RootStore";

/**
 * Store which manages `Meal` models.
 */
export class MealsStore {
  /**
   * Cached meal models of specific dates.
   */
  @observable private cache: Map<string, Meal[]> = new Map();

  /**
   * Root store instance.
   */
  public rootStore: RootStore;

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
    return [...this.cache.values()].flat().find(meal => meal.id === id);
  }

  /**
   * Returns whether meal with specified name exists.
   */
  public hasWithName(name: string) {
    return [...this.cache.values()].flat().some(meal => meal.name === name);
  }

  /**
   * Returns currently stored meals at specified date.
   */
  public mealsOf(date: Date) {
    return this.cache.get(toIsoDateString(date)) || [];
  }

  /**
   * Clears all stored data.
   */
  @action
  public clear() {
    this.cache.clear();
  }

  /**
   * Creates a new meal with specified `name` and `date`.
   */
  @action
  public async create(name: string, date: Date) {
    const dateString = toIsoDateString(date);

    const result = await Rpc.call("meal", "create", {
      name,
      date: dateString
    });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }

    (await this.getAll(date)).push(new Meal(result.value, this));
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

    meal.dishes.push(new Dish(result.value, meal, this));
  }

  /**
   * Replaces currently stored meal models with meals with specified `date`.
   */
  @action
  public async getAll(date: Date) {
    const dateString = toIsoDateString(date);

    if (!this.cache.has(dateString)) {
      const result = await Rpc.call("meal", "getAll", {
        accountId: undefined,
        date: dateString
      });

      if (!result.ok) {
        this.rootStore.views.notifyUnknownError();
      }

      this.cache.set(
        dateString,
        !result.ok ? [] : result.value.map(dto => new Meal(dto, this))
      );
    }

    return this.cache.get(dateString)!;
  }

  /**
   * Moves specified `meal` to specified `index`.
   */
  @action
  public async insert(meal: Meal, index: number) {
    const meals = await this.getAll(new Date(meal.date));

    meals.splice(meals.indexOf(meal), 1);
    meals.splice(index, 0, meal);

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

    const meals = await this.getAll(new Date(meal.date));
    meals.splice(meals.indexOf(meal), 1);

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

    const result = await Rpc.call("dish", "setEaten", { id: dish.id, eaten });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Sets the quantity specified `dish` to specified `quantity`.
   */
  @action
  public async setDishQuantity(dish: Dish, quantity: number) {
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
