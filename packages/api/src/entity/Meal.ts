import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

import { Consumable } from "./Consumable";
import { Person } from "./Person";

/**
 * Collection of consumed food items.
 */
@Entity()
@Unique(["person", "name", "date"])
export class Meal extends BaseEntity {
  /**
   * Meal ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Person who had this meal.
   */
  @ManyToOne(() => Person, { nullable: false })
  public person!: Person;

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
  @OneToMany(() => Consumable, consumable => consumable.meal)
  public consumables!: Consumable[];
}
