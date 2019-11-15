import { observable } from "mobx";
import { Quantity } from "server";

import { Measurement } from "../model/Measurement";
import { Rpc } from "../utility/rpc";
import { RootStore } from "./RootStore";

/**
 * Measurement managing store.
 */
export class MeasurementsStore {
  /**
   * Retrieved measurement cache for each body quantity.
   */
  @observable private cache: Map<Quantity, Measurement[]> = new Map();

  /**
   * Root store reference.
   */
  private readonly rootStore: RootStore;

  /**
   * Creates a new instance of `MeasurementStore`.
   */
  public constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Retrieves all measurements of specified quantity of currently authenticated
   * account if not already cached, otherwise returns previously retrieved
   * measurements.
   */
  public async getOfQuantity(quantity: Quantity) {
    const cached = this.cache.get(quantity);

    if (cached !== undefined) {
      return cached;
    }

    const result = await Rpc.call("measurement", "getOfQuantity", {
      accountId: undefined,
      quantity
    });

    if (!result.ok) {
      this.rootStore.views.notifyUnknownError();

      return [];
    }

    this.cache.set(
      quantity,
      result.value.map(dto => new Measurement(dto))
    );

    return result.value;
  }

  /**
   * Returns an array of cached measurements of specified quantity.
   */
  public measurementsOf(quantity: Quantity) {
    return this.cache.get(quantity) || [];
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
      this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Saves (creates or changes) measurement of specified `quantity` at given
   * `date` with given `value.
   */
  public async save(quantity: Quantity, date: string, value: number) {
    const result = await Rpc.call("measurement", "save", {
      quantity,
      date,
      value
    });

    if (!result.ok) {
      return this.rootStore.views.notifyUnknownError();
    }

    const measurements = this.cache.get(quantity);

    if (measurements === undefined) {
      return;
    }

    measurements.push(new Measurement(result.value));
  }

  /**
   * Clears all data stored in this store.
   */
  public clear() {
    this.cache.clear();
  }
}
