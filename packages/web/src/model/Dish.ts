import { action, observable } from "mobx";
import { DishDto } from "server";

import { MealsStore } from "../store/MealsStore";
import { Foodstuff, RequiredNutrient } from "./Foodstuff";
import { Meal } from "./Meal";

/**
 * Dish entity client-side representation.
 */
export class Dish {
  public readonly id: string;
  public readonly foodstuff: Foodstuff;
  @observable public quantity: number;
  @observable public eaten: boolean;
  public meal: Meal;

  private readonly store: MealsStore;

  /**
   * Creates a `Dish` model based on its data transfer object.
   */
  public constructor(dto: DishDto, meal: Meal, store: MealsStore) {
    this.id = dto.id;
    this.foodstuff = new Foodstuff(dto.foodstuff, store.rootStore.foodstuffs);
    this.quantity = dto.quantity;
    this.eaten = dto.eaten;
    this.meal = meal;
    this.store = store;
  }

  /**
   * Returns quantity of specified required nutrient.
   */
  public quantityOf(nutrient: RequiredNutrient) {
    return (
      (this.quantity / 100) * this.foodstuff.nutritionDeclaration[nutrient]
    );
  }

  /**
   * Deletes this dish.
   */
  @action
  public delete() {
    return this.store.deleteDish(this);
  }

  /**
   * Inserts this dish into specified meal at specified index.
   */
  @action
  public insert(meal: Meal, index: number) {
    return this.store.insertDish(this, meal, index);
  }

  /**
   * Sets the quantity of this meal.
   */
  @action
  public setQuantity(quantity: number) {
    return this.store.setDishQuantity(this, quantity);
  }
}
