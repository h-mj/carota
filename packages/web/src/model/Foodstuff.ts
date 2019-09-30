import { FoodstuffDto, NutritionDeclarationDto, Units } from "api";

import { FoodstuffsStore } from "../store/FoodstuffsStore";

/**
 * Foodstuff entity client-side representation.
 */
export class Foodstuff {
  public readonly id: string;
  public readonly name: string;
  public readonly barcode?: string;
  public readonly unit: Units;
  public readonly nutritionDeclaration: NutritionDeclarationDto;
  public readonly pieceQuantity?: number;
  private readonly store: FoodstuffsStore;

  /**
   * Creates an `Foodstuff` model based on its data transfer object.
   */
  public constructor(dto: FoodstuffDto, store: FoodstuffsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.barcode = dto.barcode;
    this.unit = dto.unit;
    this.nutritionDeclaration = dto.nutritionDeclaration;
    this.pieceQuantity = dto.pieceQuantity;
    this.store = store;
  }

  /**
   * Removes corresponding foodstuff entity.
   */
  public async remove() {
    return this.store.remove(this.id);
  }
}
