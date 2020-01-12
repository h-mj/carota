import { observable } from "mobx";
import { DishDto } from "server";

import { DishStore } from "../store/DishStore";
import { Foodstuff, RequiredNutrient } from "./Foodstuff";
import { Meal } from "./Meal";

/**
 * Client-side representation of `Dish` entity.
 */
export class Dish {
  /**
   * Dish identifier.
   */
  public readonly id: string;

  /**
   * Dish foodstuff model.
   */
  public readonly foodstuff: Foodstuff;

  /**
   * Quantity of the foodstuff that was or will be consumed.
   */
  @observable public quantity: number;

  /**
   * Whether dish has been consumed.
   */
  @observable public eaten: boolean;

  /**
   * Meal that this dish is part of.
   */
  public meal: Meal;

  /**
   * Dish store instance.
   */
  private readonly store: DishStore;

  /**
   * Creates a `Dish` model based on its data transfer object.
   */
  public constructor(dto: DishDto, meal: Meal, store: DishStore) {
    this.id = dto.id;
    this.foodstuff = new Foodstuff(
      dto.foodstuff,
      store.rootStore.foodstuffStore
    );
    this.quantity = dto.quantity;
    this.eaten = dto.eaten;
    this.meal = meal;
    this.store = store;

    this.store.register(this);
  }

  /**
   * Deletes this dish.
   */
  public delete() {
    return this.store.delete(this);
  }

  /**
   * Inserts this dish into specified meal at specified index.
   */
  public insert(meal: Meal, index: number) {
    return this.store.insert(this, meal, index);
  }

  /**
   * Sets whether this dish is eaten.
   */
  public setEaten(eaten: boolean) {
    return this.store.setEaten(this, eaten);
  }

  /**
   * Sets the quantity of this meal.
   */
  public setQuantity(quantity: number) {
    return this.store.setQuantity(this, quantity);
  }

  /**
   * Returns quantity of specified required nutrient.
   */
  public quantityOf(nutrient: RequiredNutrient) {
    return (
      this.quantity * (this.foodstuff.nutritionDeclaration[nutrient] / 100)
    );
  }
}
