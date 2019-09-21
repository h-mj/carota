import { Store } from "../store/Store";

/**
 * Generic data transfer object type.
 */
export interface Dto {
  /**
   * Generic data transfer object ID.
   */
  id: string;
}

/**
 * Model base class.
 */
export abstract class Model<
  TModel extends Model<TModel, TDto>,
  TDto extends Dto
> {
  /**
   * ID of the model.
   */
  public readonly id!: string;

  /**
   * Store that stores and manages this model.
   */
  protected readonly store: Store<TModel, TDto>;

  /**
   * Creates a new instance of some model.
   *
   * @param dto Entity data transfer object which ID will be assigned to the
   * model's ID.
   * @param store Store that stores and manages this model.
   */
  public constructor(dto: TDto, store: Store<TModel, TDto>) {
    this.id = dto.id;
    this.store = store;
  }
}

/**
 * Type which constructor creates a model `TModel` instance.
 */
export type ModelClass<
  TModel extends Model<TModel, TDto>,
  TDto extends Dto
> = new (data: TDto, store: Store<TModel, TDto>) => TModel;
