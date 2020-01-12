import { observable } from "mobx";
import { MealDto } from "server";

import { MealStore } from "../store/MealStore";
import { Dish } from "./Dish";
import { RequiredNutrient } from "./Foodstuff";

/**
 * Client-side representation of `Meal` entity.
 */
export class Meal {
  /**
   * Meal identifier.
   */
  public readonly id: string;

  /**
   * Name of the meal.
   */
  @observable public name: string;

  /**
   * Date when this meal was added.
   */
  public readonly date: string;

  /**
   * Ordered list of dishes within this meal.
   */
  @observable public dishes: Dish[] = [];

  /**
   * Meal store instance.
   */
  private readonly store: MealStore;

  /**
   * Creates an `Meal` model based on its data transfer object.
   */
  public constructor(dto: MealDto, store: MealStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.date = dto.date;
    this.dishes = dto.dishes.map(
      dish => new Dish(dish, this, store.rootStore.dishStore)
    );
    this.store = store;

    this.store.register(this);
  }

  /**
   * Deletes corresponding meal entity.
   */
  public delete() {
    return this.store.delete(this);
  }

  /**
   * Sets the index of this meal.
   */
  public insert(index: number) {
    return this.store.insert(this, index);
  }

  /**
   * Renames this meal to specified name.
   */
  public rename(name: string) {
    return this.store.rename(this, name);
  }

  /**
   * Returns quantity of specified required nutrient.
   */
  public quantityOf(nutrient: RequiredNutrient) {
    return this.dishes.reduce(
      (sum, dish) => sum + (dish.eaten ? dish.quantityOf(nutrient) : 0),
      0
    );
  }
}
