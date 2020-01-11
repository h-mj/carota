import { action, observable } from "mobx";

import { Meal } from "../model/Meal";
import { Rpc } from "../utility/rpc";
import { Store } from "./Store";

/**
 * Meal managing store.
 */
export class MealStore extends Store {
  /**
   * Cached meal models of specific dates.
   */
  @observable private cache: Map<string, Meal[]> = new Map();

  /**
   * Returns meal model with specified ID.
   */
  public withId(id: string) {
    return [...this.cache.values()].flat().find(meal => meal.id === id);
  }

  /**
   * Returns currently stored meals at specified date.
   */
  public mealsOf(date: string) {
    return this.cache.get(date) || [];
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
  public async create(name: string, date: string) {
    const result = await Rpc.call("meal", "create", { name, date });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
    }

    (await this.getAll(date)).push(new Meal(result.value, this));
  }

  /**
   * Replaces currently stored meal models with meals with specified `date`.
   */
  @action
  public async getAll(date: string) {
    if (!this.cache.has(date)) {
      const result = await Rpc.call("meal", "getAll", {
        accountId: undefined,
        date
      });

      if (!result.ok) {
        this.rootStore.viewStore.notifyUnknownError();
      }

      this.cache.set(
        date,
        !result.ok ? [] : result.value.map(dto => new Meal(dto, this))
      );
    }

    return this.cache.get(date)!;
  }

  /**
   * Moves specified `meal` to specified `index`.
   */
  @action
  public async insert(meal: Meal, index: number) {
    const meals = await this.getAll(meal.date);

    meals.splice(meals.indexOf(meal), 1);
    meals.splice(index, 0, meal);

    const result = await Rpc.call("meal", "insert", {
      id: meal.id,
      date: meal.date,
      index
    });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
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

    const meals = await this.getAll(meal.date);
    meals.splice(meals.indexOf(meal), 1);

    const result = await Rpc.call("meal", "delete", { id: meal.id });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
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
      return this.rootStore.viewStore.notifyUnknownError();
    }
  }
}
