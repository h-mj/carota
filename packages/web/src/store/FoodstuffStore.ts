import { action, observable } from "mobx";
import { Body } from "server";

import { Foodstuff } from "../model/Foodstuff";
import { Rpc } from "../utility/rpc";
import { Store } from "./Store";

/**
 * Foodstuff managing store.
 */
export class FoodstuffStore extends Store {
  /**
   * Maps meal names to their frequent foodstuffs.
   */
  @observable private frequentFoodstuffs: Map<string, Foodstuff[]> = new Map();

  /**
   * Maps search query strings to returned array of foodstuffs.
   */
  @observable private searchResults: Map<string, Foodstuff[]> = new Map();

  /**
   * Clears all data stored in this store.
   */
  @action
  public clear() {
    this.frequentFoodstuffs.clear();
    this.searchResults.clear();
  }

  /**
   * Removes all references to specified foodstuff from all cached foodstuff arrays.
   */
  private removeFromCache(foodstuff: Foodstuff) {
    const sources = [
      this.searchResults.values(),
      this.frequentFoodstuffs.values(),
    ];

    for (const source of sources) {
      for (const foodstuffs of source) {
        const index = foodstuffs.findIndex(
          (cached) => cached.id === foodstuff.id
        );

        if (index === -1) {
          continue;
        }

        foodstuffs.splice(index, 1);
      }
    }
  }

  /**
   * Deletes specified foodstuff.
   */
  public async delete(foodstuff: Foodstuff) {
    const result = await Rpc.call("foodstuff", "delete", { id: foodstuff.id });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
    }

    this.removeFromCache(foodstuff);
  }

  /**
   * Retrieves a foodstuff with specified barcode or `undefined`, if foodstuff
   * with this barcode does not exist.
   */
  public async findByBarcode(barcode: string) {
    const result = await Rpc.call("foodstuff", "findByBarcode", { barcode });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
      return undefined;
    }

    if (result.value === undefined) {
      return undefined;
    }

    return new Foodstuff(result.value, this);
  }

  /**
   * Retrieves frequent foodstuffs for a meal with specified name.
   */
  public async getLatestFrequent(name: string) {
    let foodstuffs = this.frequentFoodstuffs.get(name);

    if (foodstuffs !== undefined) {
      return foodstuffs;
    }

    const result = await Rpc.call("foodstuff", "getLatestFrequent", { name });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
      return [];
    }

    foodstuffs = result.value.map((dto) => new Foodstuff(dto, this));

    this.frequentFoodstuffs.set(name, foodstuffs);

    return foodstuffs;
  }

  /**
   * Returns cached results for frequent foodstuffs for a meal with specified name.
   */
  public frequentOf(name: string) {
    return this.frequentFoodstuffs.get(name) || [];
  }

  /**
   * Creates or changes a foodstuff entity with specified information.
   */
  public async save(body: Body<"foodstuff", "save">) {
    const result = await Rpc.call("foodstuff", "save", body);

    if (!result.ok) {
      return result.value;
    }

    this.clear();

    return undefined;
  }

  /**
   * Retrieves foodstuffs that match specified search query.
   */
  public async search(query: string) {
    let foodstuffs = this.searchResults.get(query);

    if (foodstuffs !== undefined) {
      return foodstuffs;
    }

    const result = await Rpc.call("foodstuff", "search", { query });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
      return [];
    }

    foodstuffs = result.value.map((dto) => new Foodstuff(dto, this));

    this.searchResults.set(query, foodstuffs);

    return foodstuffs;
  }

  /**
   * Returns cached search results of specified query.
   */
  public resultsOf(query: string) {
    return this.searchResults.get(query) || [];
  }
}
