import { ConsumableDto, MealDto } from "api";
import { observable } from "mobx";

import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { Rpc } from "../utility/rpc";

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
  public id(id: string) {
    return this.models.get(id)!;
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
  public async add(name: string, date: Date) {
    const result = await Rpc.call("meal", "add", {
      name,
      date: date.toISOString()
    });

    if (!result.ok) {
      return result.value;
    }

    this.insert(result.value);

    return undefined;
  }

  /**
   * Sets `quantity` of consumed `foodstuff` during specified `meal`.
   */
  public async consume(meal: Meal, foodstuff: Foodstuff, quantity: number) {
    const result = await Rpc.call("meal", "consume", {
      mealId: meal.id,
      foodstuffId: foodstuff.id,
      quantity
    });

    if (!result.ok) {
      return result.value;
    }

    meal.consumables.push(result.value);

    return undefined;
  }

  /**
   * Replaces currently stored meal models with meals with specified `date`.
   */
  public async get(date: Date) {
    this.models.clear();

    const result = await Rpc.call("meal", "get", { date: date.toISOString() });

    if (!result.ok) {
      return result.value;
    }

    result.value.map(this.insert);

    return undefined;
  }

  /**
   * Moves specified `meal` within meal linked list to specified `index`.
   */
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
    const result = await Rpc.call("meal", "move", {
      id: meal.id,
      date: meal.date,
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
