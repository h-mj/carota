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

  @ManyToOne(() => Meal, { nullable: false })
  public meal!: Meal;

  @Column()
  public mealId!: string;

  @ManyToOne(() => Foodstuff, { nullable: false, eager: true })
  public foodstuff!: Foodstuff;

  @Column("float4")
  public quantity!: number;

  @OneToOne(() => Dish, dish => dish.next)
  @JoinColumn()
  public previous!: Promise<Dish | undefined>;

  @OneToOne(() => Dish, dish => dish.previous)
  @JoinColumn()
  public next!: Promise<Dish | undefined>;

  @Column()
  public nextId!: string | null;

  public toDto = () => ({
    id: this.id,
    foodstuff: this.foodstuff.toDto(),
    quantity: this.quantity
  });
}

export type DishDto = ReturnType<Dish["toDto"]>;
