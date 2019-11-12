import { MeasurementDto, Quantity } from "server";

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
  public readonly value: number;

  /**
   * Creates an instance of `Measurement` model based on the data transfer
   * object.
   */
  public constructor(dto: MeasurementDto) {
    this.id = dto.id;
    this.quantity = dto.quantity;
    this.date = dto.date;
    this.value = dto.value;
  }
}
