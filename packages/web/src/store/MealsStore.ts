import { MealDto } from "api/src/entity/Meal";
import { action, computed } from "mobx";

import { FoodstuffModel } from "../model/FoodstuffModel";
import { MealModel } from "../model/MealModel";
import { post } from "../utility/client";
import { Store } from "./Store";

/**
 * Store that stores and manages meal models.
 */
export class MealsStore extends Store<MealModel, MealDto> {
  /**
   * Array of ordered meals.
   */
  @computed
  public get ordered() {
    const links: Map<string | undefined, string> = new Map();

    for (const meal of this.getAll()) {
      links.set(meal.nextId, meal.id);
    }

    const order: MealModel[] = [];
    let previous: string | undefined = undefined;

    while (links.has(previous)) {
      previous = links.get(previous);
      order.push(this.get(previous!)!);
    }

    return order.reverse();
  }

  /**
   * Loads and replaces current data with meals with specified date.
   */
  @action
  public async load(date: Date) {
    const response = await post("meal", "get", { date: date.toISOString() });

    if ("error" in response) {
      return response.error;
    }

    this.clear();
    response.data.map(this.add);

    return undefined;
  }

  /**
   * Creates a meal with specified name and date.
   *
   * @param name Meal name.
   * @param date Meal date.
   */
  @action
  public async create(name: string, date: Date) {
    const response = await post("meal", "add", {
      name,
      date: date.toISOString()
    });

    if ("error" in response) {
      return response.error;
    }

    const order = this.ordered;

    if (order.length > 0) {
      order[order.length - 1].nextId = response.data.id;
    }

    this.add(response.data);

    return undefined;
  }

  /**
   * Adds a consumable to specified meal.
   */
  @action
  public async addConsumable(
    meal: MealModel,
    foodstuff: FoodstuffModel,
    quantity: number
  ) {
    const response = await post("meal", "addConsumable", {
      mealId: meal.id,
      foodstuffId: foodstuff.id,
      quantity
    });

    if ("error" in response) {
      return response.error;
    }

    meal.consumables.push(response.data);

    return null;
  }

  /**
   * Moves a meal with specified ID to specified index in the order.
   */
  @action
  public async move(id: string, index: number) {
    const meal = this.get(id)!;
    const order = this.ordered;

    // Temporarily remove current meal from the array to find its subsequent
    // meal.
    order.splice(order.indexOf(meal), 1);

    const next: MealModel | undefined = order[index];
    const nextId = next === undefined ? undefined : next.id;

    // Add meal back to its new position.
    order.splice(index, 0, meal);

    // Update meal order.
    for (let i = 0; i < order.length; ++i) {
      order[i].nextId =
        order[i + 1] === undefined ? undefined : order[i + 1].id;
    }

    // Make the move meal request so that order is updated on the server too.
    const response = await post("meal", "move", {
      id,
      date: meal.date,
      nextId
    });

    if ("error" in response) {
      return response.error;
    }

    // Even though server returns updated meals, current meal order should be
    // correct and there would not be any changes even if meals were to be
    // updated, so the result is ignored.

    return undefined;
  }
}
