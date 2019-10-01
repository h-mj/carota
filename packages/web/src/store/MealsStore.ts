import { ConsumableDto, MealDto } from "api";
import { action, observable } from "mobx";

import { Consumable } from "../model/Consumable";
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
  @observable public models: Map<string, Meal> = new Map();

  /**
   * Returns an array of currently stored meal models in correct order.
   */
  public get meals() {
    const links: Map<string | undefined, string> = new Map();

    for (const meal of this.models.values()) {
      links.set(meal.nextId, meal.id);
    }

    const meals: Meal[] = [];
    let iterator: string | undefined = undefined;

    while (links.has(iterator)) {
      iterator = links.get(iterator);
      meals.push(this.models.get(iterator!)!);
    }

    return meals.reverse();
  }

  /**
   * Creates and stores meal model of specified `data transfer object`.
   */
  private insert = (dto: MealDto) => {
    const model = new Meal(dto, this);
    this.models.set(model.id, model);
  };

  /**
   * Returns meal model with specified ID.
   */
  public withId(id: string) {
    return this.models.get(id);
  }

  /**
   * Clears all stored data.
   */
  public clear() {
    this.models.clear();
  }

  /**
   * Adds a new meal with specified `name` and `date`.
   */
  @action
  public async add(name: string, date: Date) {
    const result = await Rpc.call("meal", "add", {
      name,
      date: toDateString(date)
    });

    if (!result.ok) {
      return result.value;
    }

    // Append created meal to the linked list.
    const meals = this.meals;
    if (meals.length > 0) {
      meals[meals.length - 1].nextId = result.value.id;
    }

    this.insert(result.value);

    return undefined;
  }

  /**
   * Sets `quantity` of consumed `foodstuff` during specified `meal`.
   */
  @action
  public async consume(meal: Meal, foodstuff: Foodstuff, quantity: number) {
    const result = await Rpc.call("meal", "consume", {
      mealId: meal.id,
      foodstuffId: foodstuff.id,
      quantity
    });

    if (!result.ok) {
      return result.value;
    }

    // Append returned consumable to the linked list if it didn't exist already.
    const consumables = meal.consumables;
    if (consumables.length > 0 && !meal.has(result.value.id)) {
      consumables[consumables.length - 1].nextId = result.value.id;
    }

    meal.insert(result.value);

    return undefined;
  }

  /**
   * Replaces currently stored meal models with meals with specified `date`.
   */
  @action
  public async get(date: Date) {
    this.models.clear();

    const result = await Rpc.call("meal", "get", { date: toDateString(date) });

    if (!result.ok) {
      return result.value;
    }

    result.value.forEach(this.insert);

    return undefined;
  }

  /**
   * Moves specified `meal` within meal linked list to specified `index`.
   */
  @action
  public async move(meal: Meal, index: number) {
    const meals = this.meals;

    // Temporarily remove current meal from the array to find its subsequent
    // meal.
    meals.splice(meals.indexOf(meal), 1);

    const next: Meal | undefined = meals[index];
    const nextId = next === undefined ? undefined : next.id;

    // Add meal back to its new position.
    meals.splice(index, 0, meal);

    // Update meal order.
    for (let i = 0; i < meals.length; ++i) {
      meals[i].nextId =
        meals[i + 1] === undefined ? undefined : meals[i + 1].id;
    }

    // Make the move meal request so that order is updated on the server too.
    const result = await Rpc.call("meal", "move", { id: meal.id, nextId });

    if (!result.ok) {
      return result.value;
    }

    return undefined;
  }

  /**
   * Moves specified consumable to specified meal at specified index.
   */
  @action
  public async reorder(consumable: Consumable, meal: Meal, index: number) {
    // Delete consumable from its meal and relink the linked list.
    const source = consumable.meal.consumables;

    consumable.meal.delete(consumable);
    source.splice(source.indexOf(consumable), 1);

    for (let i = 0; i < source.length; ++i) {
      source[i].nextId =
        source[i + 1] === undefined ? undefined : source[i + 1].id;
    }

    // Add consumable to its target position and updates the linked list.
    const target = meal.consumables;
    const next: Consumable | undefined = target[index];
    const nextId = next === undefined ? undefined : next.id;

    meal.insert(consumable);
    consumable.meal = meal;
    target.splice(index, 0, consumable);

    for (let i = 0; i < target.length; ++i) {
      target[i].nextId =
        target[i + 1] === undefined ? undefined : target[i + 1].id;
    }

    // Make the reorder consumable request so that order is updated on the server too.
    const result = await Rpc.call("meal", "reorder", {
      id: consumable.id,
      mealId: meal.id,
      nextId
    });

    if (!result.ok) {
      return result.value;
    }

    return undefined;
  }

  /**
   * Removes specified `meal`.
   */
  public async remove(meal: Meal) {
    throw new Error(meal.id);
  }

  /**
   * Unconsumed specified `consumable`.
   */
  public async unconsume(consumable: ConsumableDto) {
    throw new Error(consumable.id);
  }
}
