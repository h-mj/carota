import { Store } from "../store/Store";

/**
 * Generic data type.
 */
export interface Data {
  /**
   * Generic data ID.
   */
  id: string;
}

/**
 * Model base class.
 */
export abstract class Model<
  TModel extends Model<TModel, TData>,
  TData extends Data
> {
  /**
   * ID of the model.
   */
  public readonly id!: string;

  /**
   * Store that stores and manages this model.
   */
  protected readonly store: Store<TModel, TData>;

  /**
   * Creates a new instance of some model.
   *
   * @param data Model data object which ID will be assigned to the model's ID.
   * @param store Store that stores and manages this model.
   */
  public constructor(data: TData, store: Store<TModel, TData>) {
    this.id = data.id;
    this.store = store;
  }
}

/**
 * Type which constructor creates a model `TModel` instance.
 */
export type ModelClass<
  TModel extends Model<TModel, TData>,
  TData extends Data
> = new (data: TData, store: Store<TModel, TData>) => TModel;
