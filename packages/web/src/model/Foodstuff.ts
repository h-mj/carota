import { FoodstuffDto, NutritionDeclarationDto, Unit } from "server";

import { FoodstuffsStore } from "../store/FoodstuffsStore";

/**
 * Array of required nutrient names in most common order.
 */
export const REQUIRED_NUTRIENTS = [
  "energy",
  "protein",
  "fat",
  "carbohydrate"
] as const;

/**
 * Union of required nutrients.
 */
export type RequiredNutrient = typeof REQUIRED_NUTRIENTS[number];

/**
 * Foodstuff entity client-side representation.
 */
export class Foodstuff {
  public readonly id: string;
  public readonly name: string;
  public readonly barcode?: string;
  public readonly unit: Unit;
  public readonly packageSize?: number;
  public readonly pieceQuantity?: number;
  public readonly nutritionDeclaration: NutritionDeclarationDto;
  public readonly deletable: boolean;
  public readonly editable: boolean;

  private readonly store: FoodstuffsStore;

  /**
   * Creates an `Foodstuff` model based on its data transfer object.
   */
  public constructor(dto: FoodstuffDto, store: FoodstuffsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.barcode = dto.barcode;
    this.unit = dto.unit;
    this.packageSize = dto.packageSize;
    this.pieceQuantity = dto.pieceQuantity;
    this.nutritionDeclaration = dto.nutritionDeclaration;
    this.deletable = dto.deletable;
    this.editable = dto.editable;
    this.store = store;
  }

  /**
   * Deletes corresponding foodstuff entity.
   */
  public async delete() {
    return this.store.delete(this.id);
  }
}
