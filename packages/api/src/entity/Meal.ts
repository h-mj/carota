import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

import { Account } from "./Account";
import { Consumable } from "./Consumable";

/**
 * Collection of consumed foodstuffs during a single meal at some date.
 */
@Entity()
export class Meal extends BaseEntity {
  /**
   * Meal ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Account which created this meal.
   */
  @ManyToOne(() => Account, { eager: true, nullable: false })
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
   * List of consumed foodstuffs.
   */
  @OneToMany(() => Consumable, consumable => consumable.meal, { eager: true })
  public consumables!: Consumable[];

  /**
   * Returns a representation of this entity that will be transferred to the
   * client.
   */
  public toDto = () => ({
    id: this.id,
    name: this.name,
    date: this.date,
    consumables:
      this.consumables != undefined
        ? this.consumables.map(consumable => consumable.toDto())
        : []
  });
}

/**
 * Meal entity data transfer object type.
 */
export type MealDto = ReturnType<Meal["toDto"]>;
