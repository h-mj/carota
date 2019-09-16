import { FoodData, NutritionDeclarationData, Units } from "api";

import { Store } from "../store/Store";
import { Model } from "./Model";

export class FoodModel extends Model<FoodModel, FoodData> {
  public readonly name: string;
  public readonly barcode: string | undefined;
  public readonly unit: Units;
  public readonly nutritionDeclaration: NutritionDeclarationData;
  public readonly pieceQuantity: number | undefined;

  public constructor(data: FoodData, store: Store<FoodModel, FoodData>) {
    super(data, store);

    this.name = data.name;
    this.barcode = data.barcode;
    this.unit = data.unit;
    this.nutritionDeclaration = data.nutritionDeclaration;
    this.pieceQuantity = data.pieceQuantity;
  }
}
