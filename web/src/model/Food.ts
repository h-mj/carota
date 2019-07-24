import { FoodData, NutritionDeclarationData, Units } from "api";
import { observable } from "mobx";
import { Model } from "./Model";

export class Food extends Model<Food, FoodData> implements FoodData {
  @observable public name!: string;
  @observable public barcode?: string | undefined;
  @observable public unit!: Units;
  @observable public nutritionDeclaration!: NutritionDeclarationData;
  @observable public pieceQuantity?: number;
}
