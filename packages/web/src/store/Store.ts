import { action, observable } from "mobx";

import { Dto, Model, ModelClass } from "../model/Model";

/**
 * Base class for store classes.
 */
export class Store<TModel extends Model<TModel, TDto>, TDto extends Dto> {
  /**
   * Map that maps IDs to their model instances.
   */
  @observable private models: Map<string, TModel> = new Map();

  /**
   * Model class.
   */
  private modelClass: ModelClass<TModel, TDto>;

  /**
   * Creates a new instance of `Store`.
   */
  public constructor(modelClass: ModelClass<TModel, TDto>) {
    this.modelClass = modelClass;
  }

  /**
   * Returns a model with given ID, or `undefined`, if model with that Id does
   * not exist.
   */
  public get = (id: string) => {
    return this.models.get(id);
  };

  /**
   * Returns an array of all models.
   */
  public getAll = () => {
    return Array.from(this.models.values());
  };

  /**
   * Creates a new model instance if model data transfer object is provided and
   * adds and returns created instance to map `data`. If model instance is
   * provided, adds and returns that instance instead.
   *
   * @param model Model instance or model data transfer object.
   */
  @action
  public add = (model: TModel | TDto) => {
    const instance =
      model instanceof Model ? model : new this.modelClass(model, this);

    this.models.set(instance.id, instance);

    return instance;
  };

  /**
   * Removes an entry with specified ID.
   *
   * @param id Model ID.
   */
  @action
  public remove = (id: string) => {
    this.models.delete(id);
  };

  /**
   * Clears data map.
   */
  @action
  public clear = () => {
    this.models.clear();
  };
}
