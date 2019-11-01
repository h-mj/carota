import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { allow } from "../../utility/authorization";
import { Account } from "../account/Account";
import { Foodstuff } from "../foodstuff/Foodstuff";
import { Meal } from "../meal/Meal";

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

  public toDto = (principal: Account) => ({
    id: this.id,
    foodstuff: this.foodstuff.toDto(principal),
    quantity: this.quantity,
    eaten: this.eaten
  });
}

export type DishDto = ReturnType<Dish["toDto"]>;

// prettier-ignore
{
  allow(Account, "delete", Dish, (account, dish) => dish.meal !== undefined && account.id === dish.meal.accountId);
  allow(Account, "eat", Dish, (account, dish) => dish.meal !== undefined && account.id === dish.meal.accountId);
  allow(Account, "set quantity of", Dish, (account, dish) => dish.meal !== undefined && account.id === dish.meal.accountId);
}
