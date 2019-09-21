import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

import { Account } from "./Account";
import { Consumable } from "./Consumable";

/**
 * Collection of consumed food items.
 */
@Entity()
@Unique(["account", "name", "date"])
export class Meal extends BaseEntity {
  /**
   * Meal ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Account which created this meal.
   */
  @ManyToOne(() => Account, { nullable: false })
  public account!: Account;

  /**
   * Meal name.
   */
  @Column()
  public name!: string;

  /**
   * Meal date.
   */
  @Column("date")
  public date!: string;

  /**
   * List of consumed food items.
   */
  @OneToMany(() => Consumable, consumable => consumable.meal, { eager: true })
  public consumables!: Consumable[];

  /**
   * Returns a representation of this model that will be transferred to the
   * client.
   */
  public toData = () => ({
    id: this.id,
    name: this.name,
    date: this.date,
    consumables: this.consumables.map(consumable => consumable.toData())
  });
}

/**
 * Meal model data transfer object type.
 */
export type MealData = ReturnType<Meal["toData"]>;
