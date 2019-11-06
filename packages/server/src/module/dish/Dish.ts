import { Canallo } from "canallo";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { DtoOf } from "../../utility/types";
import { Account } from "../account/Account";
import { Foodstuff } from "../foodstuff/Foodstuff";
import { isAccountMealOwner, Meal } from "../meal/Meal";

@Entity()
export class Dish {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToOne(() => Meal)
  public meal?: Meal;

  @Column({ nullable: true })
  public mealId!: string | null;

  @ManyToOne(() => Foodstuff, { nullable: false, eager: true })
  public foodstuff!: Foodstuff;

  @Column("float4")
  public quantity!: number;

  @Column()
  public eaten!: boolean;

  @OneToOne(() => Dish, dish => dish.next)
  public previous!: Promise<Dish | undefined>;

  @OneToOne(() => Dish, dish => dish.previous)
  @JoinColumn()
  public next!: Promise<Dish | undefined>;

  @Column({ nullable: true })
  public nextId!: string | null;

  public toDto = async (principal: Account) => ({
    id: this.id,
    foodstuff: await this.foodstuff.toDto(principal),
    quantity: this.quantity,
    eaten: this.eaten
  });
}

export type DishDto = DtoOf<Dish>;

const isAccountDishOwner = (account: Account, dish: Dish) =>
  dish.meal !== undefined && isAccountMealOwner(account, dish.meal);

export const { authorize } = new Canallo()
  .allow(Account, "delete", Dish, isAccountDishOwner)
  .allow(Account, "eat", Dish, isAccountDishOwner)
  .allow(Account, "set quantity of", Dish, isAccountDishOwner);
