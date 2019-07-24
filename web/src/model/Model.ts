import { observable, set } from "mobx";
import { Store } from "../store/Store";

/**
 * Type of data of given model `TModel`.
 */
export type ModelData<TModel extends Model<TModel>> = TModel extends Model<
  infer _,
  infer IData
>
  ? IData
  : never;

/**
 * Type which constructor creates a model `TModel` instance.
 */
export type ModelClass<TModel extends Model<TModel>> = new (
  data: ModelData<TModel>,
  store: Store<TModel>
) => TModel;

/**
 * Model base class.
 */
export abstract class Model<TModel extends Model<TModel>, TData = {}> {
  /**
   * ID of the model.
   */
  @observable public id!: string;

  /**
   * Store that stores and manages this model.
   */
  protected store: Store<TModel>;

  /**
   * Creates a new instance of some model.
   *
   * @param data Model data object which field values will be assigned to the
   * corresponding model fields.
   * @param store Store that stores and manages this model.
   */
  public constructor(data: TData, store: Store<TModel>) {
    this.store = store;
    set(this, data);
  }

  /**
   * Included so that TypeScript's infer would work, since it uses object
   * structure to determine types.
   */
  // @ts-ignore
  private dataType?: TData;
}
