import { ConsumableDto, MealDto } from "api";

import { Store } from "../store/Store";
import { Model } from "./Model";

export class MealModel extends Model<MealModel, MealDto> {
  public name: string;
  public date: string;
  public consumables: ConsumableDto[];
  public nextId: string | undefined;

  public constructor(dto: MealDto, store: Store<MealModel, MealDto>) {
    super(dto, store);

    this.name = dto.name;
    this.date = dto.date;
    this.consumables = dto.consumables;
    this.nextId = dto.nextId;
  }
}
