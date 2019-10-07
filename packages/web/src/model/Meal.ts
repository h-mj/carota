import { ConsumableDto, MealDto } from "api";
import { action, computed, observable } from "mobx";

import { MealsStore } from "../store/MealsStore";
import { Consumable } from "./Consumable";
import { Foodstuff, RequiredNutrient } from "./Foodstuff";

/**
 * Meal entity client-side representation.
 */
export class Meal {
  public readonly id: string;
  @observable public name: string;
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
   * Optionally creates and stores consumable model of specified `data transfer
   * object`.
   */
  @action
  public insert = (dto: Consumable | ConsumableDto) => {
    const consumable =
      dto instanceof Consumable ? dto : new Consumable(dto, this);
    this.consumableMap.set(consumable.id, consumable);
  };

  /**
   * Returns stored consumable with specified id.
   */
  public withId(id: string) {
    return this.consumableMap.get(id);
  }

  /**
   * Deletes specified consumable from the storage.
   */
  @action
  public delete(consumable: Consumable) {
    this.consumableMap.delete(consumable.id);
  }

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

  /**
   * Renames this meal to specified name.
   */
  @action
  public async rename(name: string) {
    return this.store.rename(this, name);
  }

  /**
   * Returns quantity of specified required nutrient.
   */
  public quantityOf(nutrient: RequiredNutrient) {
    return this.consumables.reduce(
      (sum, consumable) => sum + consumable.quantityOf(nutrient),
      0
    );
  }
}
