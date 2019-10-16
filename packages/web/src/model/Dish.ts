import { DishDto, FoodstuffDto } from "server";

import { RequiredNutrient } from "./Foodstuff";
import { Meal } from "./Meal";

/**
 * Dish entity client-side representation.
 */
export class Dish {
  public readonly id: string;
  public readonly foodstuff: FoodstuffDto;
  public readonly quantity: number;
  public meal: Meal;

  /**
   * Creates a `Dish` model based on its data transfer object.
   */
  public constructor(dto: DishDto, meal: Meal) {
    this.id = dto.id;
    this.foodstuff = dto.foodstuff;
    this.quantity = dto.quantity;
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
