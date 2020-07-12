import { FoodstuffDto, NutritionDeclarationDto, Unit } from "server";

import { FoodstuffStore } from "../store/FoodstuffStore";

/**
 * Array of required nutrient names in most common order.
 */
export const REQUIRED_NUTRIENTS = [
  "energy",
  "protein",
  "fat",
  "carbohydrate",
] as const;

/**
 * Union of required nutrients.
 */
export type RequiredNutrient = typeof REQUIRED_NUTRIENTS[number];

/**
 * Client side representation of **Foodstuff** entity.
 */
export class Foodstuff {
  /**
   * Foodstuff ID.
   */
  public readonly id: string;

  /**
   * Foodstuff name.
   */
  public readonly name: string;

  /**
   * Foodstuff barcode.
   */
  public readonly barcode?: string;

  /**
   * Unit in which the foodstuff quantity is measured.
   */
  public readonly unit: Unit;

  /**
   * Package size in units in which the foodstuff is sold.
   */
  public readonly packageSize?: number;

  /**
   * Quantity in units of one piece of this foodstuff.
   */
  public readonly pieceQuantity?: number;

  /**
   * Foodstuff nutritional information.
   */
  public readonly nutritionDeclaration: NutritionDeclarationDto;

  /**
   * Whether this foodstuff can be deleted by currently authenticated user.
   */
  public readonly deletable: boolean;

  /**
   * Whether this foodstuff can be edited by currently authenticated user.
   */
  public readonly editable: boolean;

  /**
   * Foodstuff store reference.
   */
  private readonly store: FoodstuffStore;

  /**
   * Creates a new instance `Foodstuff` model based on the data transfer object.
   */
  public constructor(dto: FoodstuffDto, store: FoodstuffStore) {
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
   * Deletes this foodstuff.
   */
  public delete() {
    return this.store.delete(this);
  }
}
