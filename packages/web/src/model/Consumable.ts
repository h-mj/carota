import { ConsumableDto, FoodstuffDto } from "api";
import { observable } from "mobx";

import { RequiredNutrient } from "./Foodstuff";
import { Meal } from "./Meal";

/**
 * Consumable entity client-side representation.
 */
export class Consumable {
  public readonly id: string;
  public readonly foodstuff: FoodstuffDto;
  @observable public quantity: number;
  @observable public nextId?: string;
  public meal: Meal;

  /**
   * Creates an `Consumable` model based on its data transfer object.
   */
  public constructor(dto: ConsumableDto, meal: Meal) {
    this.id = dto.id;
    this.foodstuff = dto.foodstuff;
    this.quantity = dto.quantity;
    this.nextId = dto.nextId;
    this.meal = meal;
  }

  /**
   * Returns quantity of specified required nutrient.
   */
  public quantityOf(nutrient: RequiredNutrient) {
    return (
      (this.quantity / 100) * this.foodstuff.nutritionDeclaration[nutrient]
    );
  }
}
