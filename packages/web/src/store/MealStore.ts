import { action, observable } from "mobx";

import { Meal } from "../model/Meal";
import { Rpc } from "../utility/rpc";
import { CachedStore } from "./CachedStore";

/**
 * Meal managing store.
 */
export class MealStore extends CachedStore<Meal> {
  /**
   * Cached meal models of specific dates.
   */
  @observable private meals: Map<string, Meal[]> = new Map();

  /**
   * Tracks whether meals of some date are currently being loaded.
   */
  private loading: Map<string, boolean> = new Map();

  /**
   * Returns currently stored meals at specified date.
   */
  public withDate(date: string) {
    if (!this.meals.has(date)) {
      this.load(date);
    }

    return this.meals.get(date) ?? [];
  }

  /**
   * Clears all stored data.
   */
  public clear() {
    super.clear();

    this.meals.clear();
    this.loading.clear();
  }

  /**
   * Replaces currently stored meal models with meals with specified `date`.
   */
  public async load(date: string) {
    if (this.loading.get(date)) {
      return;
    }

    this.loading.set(date, true);

    const result = await Rpc.call("meal", "getAll", {
      accountId: undefined,
      date,
    });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
    }

    this.meals.set(
      date,
      result.ok ? result.value.map((dto) => new Meal(dto, this)) : []
    );

    this.loading.set(date, false);
  }

  /**
   * Creates a new meal with specified `name` and `date`.
   */
  @action
  public async create(name: string, date: string) {
    const result = await Rpc.call("meal", "create", { name, date });

    if (!result.ok) {
      return result.value;
    }

    const meals = this.meals.get(date);

    if (meals !== undefined) {
      meals.push(new Meal(result.value, this));
    }

    return;
  }

  /**
   * Moves specified `meal` to specified `index`.
   */
  @action
  public async insert(meal: Meal, index: number) {
    const meals = this.meals.get(meal.date);

    if (meals !== undefined) {
      meals.splice(meals.indexOf(meal), 1);
      meals.splice(index, 0, meal);
    }

    const result = await Rpc.call("meal", "insert", {
      id: meal.id,
      date: meal.date,
      index,
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

    const result = await Rpc.call("meal", "delete", { id: meal.id });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
    }

    const meals = this.meals.get(meal.date);

    if (meals !== undefined) {
      meals.splice(meals.indexOf(meal), 1);
    }

    this.unregister(meal);
  }

  /**
   * Renames specified meal to specified name.
   */
  public async rename(meal: Meal, name: string) {
    const result = await Rpc.call("meal", "rename", { id: meal.id, name });

    if (!result.ok) {
      return result.value;
    }

    meal.name = name;

    return;
  }
}
