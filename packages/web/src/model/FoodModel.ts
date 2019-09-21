import { FoodDto, NutritionDeclarationDto, Units } from "api";

import { Store } from "../store/Store";
import { Model } from "./Model";

export class FoodModel extends Model<FoodModel, FoodDto> {
  public readonly name: string;
  public readonly barcode: string | undefined;
  public readonly unit: Units;
  public readonly nutritionDeclaration: NutritionDeclarationDto;
  public readonly pieceQuantity: number | undefined;

  public constructor(data: FoodDto, store: Store<FoodModel, FoodDto>) {
    super(data, store);

    this.name = data.name;
    this.barcode = data.barcode;
    this.unit = data.unit;
    this.nutritionDeclaration = data.nutritionDeclaration;
    this.pieceQuantity = data.pieceQuantity;
  }
}
