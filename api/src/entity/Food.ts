import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Enum, FoodData, Units } from "../../types";
import { Account } from "./Account";
import { NutritionDeclaration } from "./NutritionDeclaration";

/**
 * Object that is used as unit enumeration.
 */
export const UNITS_ENUM: Enum<Units> = {
  g: "g",
  ml: "ml"
};

/**
 * Entity that holds information about a specific food alongside its nutritional
 * information.
 */
@Entity()
export class Food extends BaseEntity {
  /**
   * Food ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * The name of the food.
   */
  @Column()
  public name!: string;

  /**
   * Barcode of the food, if exists.
   */
  @Column("text", { nullable: true })
  public barcode!: string | null;

  /**
   * Serving unit.
   */
  @Column("enum", { enum: UNITS_ENUM })
  public unit!: Units;

  /**
   * Food item nutrition information.
   */
  @Column(() => NutritionDeclaration)
  public nutritionDeclaration!: NutritionDeclaration;

  /**
   * Quantity of one piece in units, if one piece of product exists.
   */
  @Column("float", { nullable: true })
  public pieceQuantity!: number | null;

  /**
   * Account of last user who edited this food.
   */
  @ManyToOne(() => Account, { nullable: false })
  public editor!: Account;

  /**
   * Creates `FoodData` type object from this instance.
   */
  public toData = (): FoodData => ({
    id: this.id,
    name: this.name,
    barcode: this.barcode || undefined,
    unit: this.unit,
    nutritionDeclaration: this.nutritionDeclaration.toData(),
    pieceQuantity: this.pieceQuantity || undefined
  });
}
