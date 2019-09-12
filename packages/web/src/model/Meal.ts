import { ConsumableData, MealData } from "api";
import { observable } from "mobx";

import { Model } from "./Model";

export class Meal extends Model<Meal, MealData> implements MealData {
  @observable public id!: string;
  @observable public name!: string;
  @observable public date!: string;
  @observable public consumables!: ConsumableData[];
}
