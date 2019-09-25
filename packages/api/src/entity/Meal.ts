import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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
   * Meal that precedes this meal.
   */
  @OneToOne(() => Meal, meal => meal.next)
  public previous!: Promise<Meal | undefined>;

  /**
   * Meal that is after this meal in the order.
   */
  @OneToOne(() => Meal, meal => meal.previous, {
    cascade: true,
    onDelete: "SET NULL"
  })
  @JoinColumn()
  public next!: Promise<Meal | undefined>;

  /**
   * ID of next meal.
   */
  @Column({ nullable: true })
  public nextId!: string | null;

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
        : [],
    nextId: this.nextId
  });
}

/**
 * Meal entity data transfer object type.
 */
export type MealDto = ReturnType<Meal["toDto"]>;
