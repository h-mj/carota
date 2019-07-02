import { action, observable } from "mobx";
import { AuthStore } from "./AuthStore";
import { FoodsStore } from "./FoodsStore";
import { ViewsStore } from "./ViewsStore";
import { Model, ModelData, ModelClass } from "../model/Model";

/**
 * Mapping between store names and their class types.
 */
interface StoreMap {
  auth: AuthStore;
  foods: FoodsStore;
  views: ViewsStore;
}

/**
 * Type that is used to add all injectable store types to component properties.
 */
export type InjectedProps = Partial<StoreMap>;

/**
 * Base class for store classes.
 */
export class Store<TModel extends Model> {
  /**
   * Map that maps IDs to their model instances.
   */
  @observable private data: Map<string, TModel> = new Map();

  /**
   * Model class.
   */
  private modelClass: ModelClass<TModel>;

  /**
   * Creates a new instance of `Store`.
   */
  public constructor(modelClass: ModelClass<TModel>) {
    this.modelClass = modelClass;
  }

  /**
   * Returns a model with given ID, or `undefined`, if model with that Id does
   * not exist.
   */
  public get = (id: string) => {
    return this.data.get(id);
  };

  /**
   * Returns an array of all models.
   */
  public getAll = () => {
    return Array.from(this.data.values());
  };

  /**
   * Creates a new model instance if model data is provided and adds created
   * instance to map `data`. If model instance is provided, adds that instance
   * instead.
   *
   * @param model Model instance or model data.
   */
  @action
  public add = (model: TModel | ModelData<TModel>) => {
    const instance =
      model instanceof Model ? model : new this.modelClass(model, this);

    this.data.set(instance.id, instance);
  };

  /**
   * Removes an entry with specified ID.
   *
   * @param id Model ID.
   */
  @action
  public remove = (id: string) => {
    this.data.delete(id);
  };

  /**
   * Clears data map.
   */
  @action
  public clear = () => {
    this.data.clear();
  };
}
