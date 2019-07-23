import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Enum, FoodData, Units } from "../../types";
import { Account } from "./Account";

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
   * Quantity of one piece in units, if one piece of product exists.
   */
  @Column("float", { nullable: true })
  public pieceQuantity!: number | null;

  /**
   * Amount of energy in kilocalories.
   */
  @Column("float")
  public energy!: number;

  /**
   * Amount of fat in grams.
   */
  @Column("float")
  public fat!: number;

  /**
   * Amount of saturates in grams.
   */
  @Column("float", { nullable: true })
  public saturates!: number | null;

  /**
   * Amount of mono-unsaturates in grams.
   */
  @Column("float", { nullable: true })
  public monoUnsaturates!: number | null;

  /**
   * Amount of polyunsaturates in grams.
   */
  @Column("float", { nullable: true })
  public polyunsaturates!: number | null;

  /**
   * Amount of carbohydrate in grams.
   */
  @Column("float")
  public carbohydrate!: number;

  /**
   * Amount of sugars in grams.
   */
  @Column("float", { nullable: true })
  public sugars!: number | null;

  /**
   * Amount of polyols in grams.
   */
  @Column("float", { nullable: true })
  public polyols!: number | null;

  /**
   * Amount of starch in grams.
   */
  @Column("float", { nullable: true })
  public starch!: number | null;

  /**
   * Amount of fibre in grams.
   */
  @Column("float", { nullable: true })
  public fibre!: number | null;

  /**
   * Amount of protein in grams.
   */
  @Column("float")
  public protein!: number;

  /**
   * Amount of salt in grams.
   */
  @Column("float", { nullable: true })
  public salt!: number | null;

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
    nutritionDeclaration: {
      energy: this.energy,
      fat: this.fat,
      saturates: this.saturates || undefined,
      monoUnsaturates: this.monoUnsaturates || undefined,
      polyunsaturates: this.polyunsaturates || undefined,
      carbohydrate: this.carbohydrate,
      sugars: this.sugars || undefined,
      polyols: this.polyols || undefined,
      starch: this.starch || undefined,
      fibre: this.fibre || undefined,
      protein: this.protein,
      salt: this.salt || undefined
    },
    pieceQuantity: this.pieceQuantity || undefined
  });
}
