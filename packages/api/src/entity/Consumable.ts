import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

import { Food } from "./Food";
import { Meal } from "./Meal";

/**
 * One of the consumed food items during a meal.
 */
@Entity()
@Unique(["meal", "food"])
export class Consumable extends BaseEntity {
  /**
   * Consumable ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Meal that this consumed food item is part of.
   */
  @ManyToOne(() => Meal, { nullable: false })
  public meal!: Meal;

  /**
   * Food that was consumed.
   */
  @ManyToOne(() => Food, { nullable: false, eager: true })
  public food!: Food;

  /**
   * Quantity of food that was consumed.
   */
  @Column("float4")
  public quantity!: number;

  /**
   * Returns a representation of this entity that will be transferred to the
   * client.
   */
  public toDto = () => ({
    id: this.id,
    food: this.food.toDto(),
    quantity: this.quantity
  });
}

/**
 * Consumable entity data transfer object type.
 */
export type ConsumableDto = ReturnType<Consumable["toDto"]>;
