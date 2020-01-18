import { observable } from "mobx";

import { Model } from "../model/Model";
import { Store } from "./Store";

/**
 * Store that caches managed model instances.
 */
export abstract class CachedStore<T extends Model> extends Store {
  /**
   * T type cache that maps model identifiers to their instances.
   */
  @observable private cache: Map<string, T> = new Map();

  /**
   * Caches specified model.
   */
  public register(model: T) {
    this.cache.set(model.id, model);
  }

  /**
   * Deletes specified model from the cache.
   */
  public unregister(model: T) {
    this.cache.delete(model.id);
  }

  /**
   * Returns cached model instance with specified identifier.
   */
  public withId(id: string) {
    return this.cache.get(id);
  }

  /**
   * Clears cached models.
   */
  public clear() {
    this.cache.clear();
  }
}
