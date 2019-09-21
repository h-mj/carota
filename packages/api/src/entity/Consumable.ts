import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

import { Foodstuff } from "./Foodstuff";
import { Meal } from "./Meal";

/**
 * Consumed foodstuff representation.
 */
@Entity()
@Unique(["meal", "foodstuff"])
export class Consumable extends BaseEntity {
  /**
   * Consumable ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Meal that this consumed foodstuff is part of.
   */
  @ManyToOne(() => Meal, { nullable: false })
  public meal!: Meal;

  /**
   * Foodstuff that was consumed.
   */
  @ManyToOne(() => Foodstuff, { nullable: false, eager: true })
  public foodstuff!: Foodstuff;

  /**
   * Quantity of foodstuff that was consumed.
   */
  @Column("float4")
  public quantity!: number;

  /**
   * Returns a representation of this entity that will be transferred to the
   * client.
   */
  public toDto = () => ({
    id: this.id,
    foodstuff: this.foodstuff.toDto(),
    quantity: this.quantity
  });
}

/**
 * Consumable entity data transfer object type.
 */
export type ConsumableDto = ReturnType<Consumable["toDto"]>;
