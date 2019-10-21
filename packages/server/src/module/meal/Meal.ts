import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { allow } from "../../utility/authorization";
import { Account } from "../account/Account";
import { Dish } from "../dish/Dish";

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

  @Column("date", { nullable: true })
  public date!: string | null;

  @OneToMany(() => Dish, dish => dish.meal)
  public dishes?: Dish[];

  @OneToOne(() => Meal, meal => meal.next)
  public previous!: Promise<Meal | undefined>;

  @OneToOne(() => Meal, meal => meal.previous)
  @JoinColumn()
  public next!: Promise<Meal | undefined>;

  @Column({ nullable: true })
  public nextId!: string | null;

  public toDto = () => ({
    id: this.id,
    name: this.name,
    date: this.date!,
    dishes:
      this.dishes != undefined ? this.dishes.map(dish => dish.toDto()) : []
  });
}

export type MealDto = ReturnType<Meal["toDto"]>;

// prettier-ignore
{
  allow(Account, "delete", Meal, (account, meal) => account.id === meal.accountId);
  allow(Account, "get all meals of", Account, (actor, target) => actor.id === target.id || actor.id === target.adviserId);
  allow(Account, "insert", Meal, (account, meal) => account.id === meal.accountId);
  allow(Account, "rename", Meal, (account, meal) => account.id === meal.accountId);
  allow(Account, "add dish to", Meal, (account, meal) => meal.accountId === account.id);
  allow(Account, "insert dish into", Meal, (account, meal) => account.id === meal.accountId);
}
