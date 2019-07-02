import { FoodData, NutritionDeclaration, Units } from "api";
import { observable } from "mobx";
import { Model } from "./Model";

export class Food extends Model<Food, FoodData> implements FoodData {
  @observable name!: string;
  @observable barcode?: string | undefined;
  @observable unit!: Units;
  @observable nutritionDeclaration!: NutritionDeclaration;
}
