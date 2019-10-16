import { computed, observable } from "mobx";
import { Body, FoodstuffDto } from "server";

import { Foodstuff } from "../model/Foodstuff";
import { Rpc } from "../utility/rpc";

/**
 * Store which manages `Foodstuff` models.
 */
export class FoodstuffsStore {
  /**
   * Stored foodstuff models.
   */
  @observable public models: Map<string, Foodstuff> = new Map();

  /**
   * Returns an array of stored foodstuff models.
   */
  @computed
  public get foodstuffs() {
    return Array.from(this.models.values());
  }

  /**
   * Creates and stores invitation model of specified data transfer object.
   */
  private insert = (dto: FoodstuffDto) => {
    const model = new Foodstuff(dto, this);
    this.models.set(model.id, model);
  };

  /**
   * Clears all stored data.
   */
  public clear() {
    this.models.clear();
  }

  /**
   * Deletes foodstuff entity with specified ID.
   */
  public async delete(id: string) {
    const result = await Rpc.call("foodstuff", "delete", { id });

    if (!result.ok) {
      return result.value;
    }

    this.models.delete(id);

    return undefined;
  }

  /**
   * Saves specified foodstuff entity.
   */
  public async save(body: Body<"foodstuff", "save">) {
    const result = await Rpc.call("foodstuff", "save", body);

    if (!result.ok) {
      return result.value;
    }

    this.insert(result.value);

    return undefined;
  }

  /**
   * Replaces currently stored foodstuffs with retrieved foodstuffs that match
   * specified search query.
   */
  public async search(query: string) {
    this.models.clear();

    const result = await Rpc.call("foodstuff", "search", { query });

    if (!result.ok) {
      return result.value;
    }

    result.value.forEach(this.insert);

    return undefined;
  }
}
