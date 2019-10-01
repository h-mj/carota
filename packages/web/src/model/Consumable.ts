import { ConsumableDto, FoodstuffDto } from "api";
import { observable } from "mobx";

/**
 * Consumable entity client-side representation.
 */
export class Consumable {
  public readonly id: string;
  public readonly foodstuff: FoodstuffDto;
  @observable public quantity: number;
  @observable public nextId?: string;

  /**
   * Creates an `Consumable` model based on its data transfer object.
   */
  public constructor(dto: ConsumableDto) {
    this.id = dto.id;
    this.foodstuff = dto.foodstuff;
    this.quantity = dto.quantity;
    this.nextId = dto.nextId;
  }
}
