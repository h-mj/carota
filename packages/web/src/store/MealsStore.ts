import { MealDto } from "api/src/entity/Meal";
import { action, observable, reaction } from "mobx";

import { MealModel } from "../model/MealModel";
import { ModelClass } from "../model/Model";
import { post } from "../utility/client";
import { Store } from "./Store";

/**
 * Store that stores and manages meal models.
 */
export class MealsStore extends Store<MealModel, MealDto> {
  /**
   * Array of meal models in correct order.
   */
  @observable public ordered: MealModel[] = [];

  /**
   * Creates `MealsStore` instance an sets models change reaction that will
   * update `ordered` array.
   */
  public constructor(modelClass: ModelClass<MealModel, MealDto>) {
    super(modelClass);
    reaction(() => this.getAll(), this.updateOrder);
  }

  /**
   * Updates `ordered` array based on currently stored meal models.
   */
  private updateOrder = () => {
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

    this.ordered = order.reverse();
  };

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

    // List created meal to the end of the meal linked list.
    if (this.ordered.length > 0) {
      this.ordered[this.ordered.length - 1].nextId = response.data.id;
    }

    this.add(response.data);

    return undefined;
  }

  /**
   * Moves a meal with specified ID to specified index in the order.
   */
  @action
  public async move(id: string, index: number) {
    const meal = this.get(id)!;
    const order = this.ordered;
    order.splice(order.indexOf(meal), 1);

    const next: MealModel | undefined = order[index];
    const nextId = next === undefined ? undefined : next.id;

    // Insert the meal to correct position in `order` array so that currently
    // visible meal order will be correct.
    order.splice(index, 0, meal);

    const response = await post("meal", "move", {
      id,
      date: meal.date,
      nextId
    });

    if ("error" in response) {
      return response.error;
    }

    // replace current meals with updated ones
    this.clear();
    response.data.map(this.add);

    return undefined;
  }
}
