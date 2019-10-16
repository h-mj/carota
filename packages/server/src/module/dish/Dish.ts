import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

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

  @OneToOne(() => Dish, dish => dish.next)
  public previous!: Promise<Dish | undefined>;

  @OneToOne(() => Dish, dish => dish.previous)
  @JoinColumn()
  public next!: Promise<Dish | undefined>;

  @Column({ nullable: true })
  public nextId!: string | null;

  public toDto = () => ({
    id: this.id,
    foodstuff: this.foodstuff.toDto(),
    quantity: this.quantity
  });
}

export type DishDto = ReturnType<Dish["toDto"]>;
