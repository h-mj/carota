import { ConsumableDto, MealDto } from "api";
import { action, computed, observable } from "mobx";

import { MealsStore } from "../store/MealsStore";
import { Consumable } from "./Consumable";
import { Foodstuff } from "./Foodstuff";

/**
 * Meal entity client-side representation.
 */
export class Meal {
  public readonly id: string;
  public readonly name: string;
  public readonly date: string;

  /**
   * Map that maps consumable IDs to the model instances.
   */
  @observable private consumableMap: Map<string, Consumable>;

  /**
   * ID of succeeding consumable.
   */
  @observable public nextId?: string;

  private readonly store: MealsStore;

  /**
   * Creates an `Meal` model based on its data transfer object.
   */
  public constructor(dto: MealDto, store: MealsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.date = dto.date;
    this.consumableMap = new Map();
    dto.consumables.forEach(this.insert);
    this.nextId = dto.nextId;
    this.store = store;
  }

  /**
   * Creates and stores consumable model of specified `data transfer object`.
   */
  @action
  public insert = (dto: ConsumableDto) => {
    const consumable = new Consumable(dto);
    this.consumableMap.set(consumable.id, consumable);
  };

  /**
   * Returns whether meal contains consumable with specified ID.
   */
  public has(id: string) {
    return this.consumableMap.has(id);
  }

  /**
   * Returns an array of consumable models of this meal in correct order.
   */
  @computed
  public get consumables() {
    const links: Map<string | undefined, string> = new Map();

    for (const consumable of this.consumableMap.values()) {
      links.set(consumable.nextId, consumable.id);
    }

    const consumables: Consumable[] = [];
    let iterator: string | undefined = undefined;

    while (links.has(iterator)) {
      iterator = links.get(iterator);
      consumables.push(this.consumableMap.get(iterator!)!);
    }

    return consumables.reverse();
  }

  /**
   * Sets quantity of consumed foodstuff during this meal.
   */
  @action
  public async consume(foodstuff: Foodstuff, quantity: number) {
    return this.store.consume(this, foodstuff, quantity);
  }

  /**
   * Removes corresponding meal entity.
   */
  @action
  public async remove() {
    return this.store.remove(this);
  }
}
