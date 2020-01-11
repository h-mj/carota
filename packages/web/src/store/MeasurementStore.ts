import { observable } from "mobx";
import { Quantity } from "server";

import { Measurement } from "../model/Measurement";
import { toIsoDateString } from "../utility/form";
import { Rpc } from "../utility/rpc";
import { Store } from "./Store";

/**
 * Measurement managing store.
 */
export class MeasurementStore extends Store {
  /**
   * Retrieved measurement cache for each body quantity.
   */
  @observable private cache: Map<Quantity, Measurement[]> = new Map();

  /**
   * Retrieves all measurements of specified quantity of currently authenticated
   * account if not already cached, otherwise returns previously retrieved
   * measurements.
   */
  private async loadQuantityMeasurements(quantity: Quantity) {
    const cached = this.cache.get(quantity);

    if (cached !== undefined) {
      return cached;
    }

    const result = await Rpc.call("measurement", "getOfQuantity", {
      accountId: undefined,
      quantity
    });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
    }

    this.cache.set(
      quantity,
      result.value.map(dto => new Measurement(dto, this))
    );
  }

  /**
   * Returns an array of cached measurements of specified quantity.
   */
  public measurementsOf(quantity: Quantity) {
    const measurements = this.cache.get(quantity);

    if (measurements === undefined) {
      this.loadQuantityMeasurements(quantity);
    }

    return measurements || [];
  }

  /**
   * Deletes specified measurement.
   */
  public async delete(measurement: Measurement) {
    const measurements = this.cache.get(measurement.quantity)!;
    measurements.splice(measurements.indexOf(measurement), 1);

    const result = await Rpc.call("measurement", "delete", {
      id: measurement.id
    });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
    }
  }

  /**
   * Saves (creates or changes) measurement of specified `quantity` at given
   * `date` with given `value.
   */
  public async save(quantity: Quantity, date: Date, value: number) {
    const dateString = toIsoDateString(date);

    const result = await Rpc.call("measurement", "save", {
      quantity,
      date: dateString,
      value
    });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
    }

    const measurements = this.cache.get(quantity);

    if (measurements === undefined) {
      return;
    }

    const measurement = measurements.find(
      measurement => measurement.date === dateString
    );

    if (measurement !== undefined) {
      measurement.value = value;
    } else {
      measurements.unshift(new Measurement(result.value, this));
    }
  }

  /**
   * Clears all data stored in this store.
   */
  public clear() {
    this.cache.clear();
  }
}
