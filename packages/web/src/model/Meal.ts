import { ConsumableDto, MealDto } from "api";
import { observable } from "mobx";

import { MealsStore } from "../store/MealsStore";
import { Foodstuff } from "./Foodstuff";

/**
 * Meal entity client-side representation.
 */
export class Meal {
  public readonly id: string;
  public readonly name: string;
  public readonly date: string;
  @observable public consumables: ConsumableDto[];
  @observable public nextId?: string;
  private readonly store: MealsStore;

  /**
   * Creates an `Meal` model based on its data transfer object.
   */
  public constructor(dto: MealDto, store: MealsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.date = dto.date;
    this.consumables = dto.consumables;
    this.nextId = dto.nextId;
    this.store = store;
  }

  /**
   * Sets quantity of consumed foodstuff during this meal.
   */
  public async consume(foodstuff: Foodstuff, quantity: number) {
    return this.store.consume(this, foodstuff, quantity);
  }

  /**
   * Removes corresponding meal entity.
   */
  public async remove() {
    return this.store.remove(this);
  }
}
