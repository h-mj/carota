import { Canallo } from "canallo";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { onUnauthorized } from "../../utility/authorization";
import { DtoOf } from "../../utility/types";
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

  public toDto = async (principal: Account) => ({
    id: this.id,
    name: this.name,
    date: this.date!, // can be `null` only if meal has been unlinked from the list and not yet relinked,
    dishes:
      this.dishes != undefined
        ? await Promise.all(this.dishes.map(dish => dish.toDto(principal)))
        : []
  });
}

export type MealDto = DtoOf<Meal>;

export const isAccountMealOwner = (account: Account, meal: Meal) =>
  account.id === meal.accountId;

// prettier-ignore
export const { authorize } = new Canallo(onUnauthorized)
  .allow(Account, "delete", Meal, isAccountMealOwner)
  .allow(Account, "get all meals of", Account, (actor, target) => actor.id === target.id || actor.id === target.adviserId)
  .allow(Account, "insert", Meal, isAccountMealOwner)
  .allow(Account, "rename", Meal, isAccountMealOwner)
  .allow(Account, "add dish to", Meal, isAccountMealOwner)
  .allow(Account, "insert dish into", Meal, isAccountMealOwner);
