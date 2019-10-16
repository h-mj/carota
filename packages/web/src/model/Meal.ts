import { action, observable } from "mobx";
import { MealDto } from "server";

import { MealsStore } from "../store/MealsStore";
import { Dish } from "./Dish";
import { Foodstuff, RequiredNutrient } from "./Foodstuff";

/**
 * Meal entity client-side representation.
 */
export class Meal {
  public readonly id: string;
  @observable public name: string;
  public readonly date: string;
  @observable public dishes: Dish[] = [];

  private readonly store: MealsStore;

  /**
   * Creates an `Meal` model based on its data transfer object.
   */
  public constructor(dto: MealDto, store: MealsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.date = dto.date;
    this.dishes = dto.dishes.map(dish => new Dish(dish, this));
    this.store = store;
  }

  /**
   * Returns stored dish with specified id.
   */
  public withId(id: string) {
    return this.dishes.find(dish => dish.id === id);
  }

  /**
   * Returns whether meal contains dish with specified ID.
   */
  public has(id: string) {
    return this.withId(id) !== undefined;
  }

  /**
   * Sets quantity of consumed foodstuff during this meal.
   */
  @action
  public async consume(foodstuff: Foodstuff, quantity: number) {
    return this.store.consume(this, foodstuff, quantity);
  }

  /**
   * Deletes corresponding meal entity.
   */
  @action
  public async delete() {
    return this.store.delete(this);
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
    return this.dishes.reduce(
      (sum, dish) => sum + dish.quantityOf(nutrient),
      0
    );
  }
}
