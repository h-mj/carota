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
  @Column({ nullable: true })
  public barcode?: string;

  /**
   * Serving unit.
   */
  @Column("enum", { enum: UNITS_ENUM })
  public unit!: Units;

  /**
   * Amount of energy in kilocalories.
   */
  @Column()
  public energy!: number;

  /**
   * Amount of fat in grams.
   */
  @Column()
  public fat!: number;

  /**
   * Amount of saturates in grams.
   */
  @Column()
  public saturates!: number;

  /**
   * Amount of mono-unsaturates in grams.
   */
  @Column()
  public monoUnsaturates!: number;

  /**
   * Amount of polyunsaturates in grams.
   */
  @Column()
  public polyunsaturates!: number;

  /**
   * Amount of carbohydrate in grams.
   */
  @Column()
  public carbohydrate!: number;

  /**
   * Amount of sugars in grams.
   */
  @Column()
  public sugars!: number;

  /**
   * Amount of polyols in grams.
   */
  @Column()
  public polyols!: number;

  /**
   * Amount of starch in grams.
   */
  @Column()
  public starch!: number;

  /**
   * Amount of fibre in grams.
   */
  @Column()
  public fibre!: number;

  /**
   * Amount of protein in grams.
   */
  @Column()
  public protein!: number;

  /**
   * Amount of salt in grams.
   */
  @Column()
  public salt!: number;

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
    barcode: this.barcode,
    unit: this.unit,
    nutritionDeclaration: {
      energy: this.energy,
      fat: this.fat,
      saturates: this.saturates,
      monoUnsaturates: this.monoUnsaturates,
      polyunsaturates: this.polyunsaturates,
      carbohydrate: this.carbohydrate,
      sugars: this.sugars,
      polyols: this.polyols,
      starch: this.starch,
      fibre: this.fibre,
      protein: this.protein,
      salt: this.salt
    }
  });
}
