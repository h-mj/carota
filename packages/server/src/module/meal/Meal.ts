import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Account } from "../account/Account";
import { Dish } from "./Dish";

@Entity()
export class Meal {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToOne(() => Account, { nullable: false })
  public account!: Account;

  @Column()
  public accountId!: string;

  @Column()
  public name!: string;

  @Column("date")
  public date!: string;

  @OneToMany(() => Dish, dish => dish.meal, { eager: true })
  public dishes!: Dish[];

  @OneToOne(() => Meal, meal => meal.next)
  @JoinColumn()
  public previous!: Promise<Meal | undefined>;

  @Column({ nullable: true })
  public previousId!: string | null;

  @OneToOne(() => Meal, meal => meal.previous)
  @JoinColumn()
  public next!: Promise<Meal | undefined>;

  @Column({ nullable: true })
  public nextId!: string | null;

  public toDto = () => ({
    id: this.id,
    name: this.name,
    date: this.date,
    dishes:
      this.dishes != undefined ? this.dishes.map(dish => dish.toDto()) : [],
    previousId: this.previousId || undefined,
    nextId: this.nextId || undefined
  });
}

/**
 * Meal entity data transfer object type.
 */
export type MealDto = ReturnType<Meal["toDto"]>;
