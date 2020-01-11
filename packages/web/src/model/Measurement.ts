import { observable } from "mobx";
import { MeasurementDto, Quantity } from "server";

import { MeasurementStore } from "../store/MeasurementStore";

/**
 * Client-side representation of **Measurement** entity.
 */
export class Measurement {
  /**
   * Measurement ID.
   */
  public readonly id: string;

  /**
   * Quantity related to the body that is being measured.
   */
  public readonly quantity: Quantity;

  /**
   * Date when measurement was measured.
   */
  public readonly date: string;

  /**
   * Measurement value.
   */
  @observable public value: number;

  /**
   * Measurement store reference.
   */
  private readonly store: MeasurementStore;

  /**
   * Creates an instance of `Measurement` model based on the data transfer
   * object.
   */
  public constructor(dto: MeasurementDto, store: MeasurementStore) {
    this.id = dto.id;
    this.quantity = dto.quantity;
    this.date = dto.date;
    this.value = dto.value;
    this.store = store;
  }

  /**
   * Deletes this measurement.
   */
  public delete() {
    return this.store.delete(this);
  }
}
