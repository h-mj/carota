import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { Enum, Units, FoodSaveData } from "../types";
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
   * Creates `FoodSaveData` type object from this instance.
   */
  public toData = (): FoodSaveData => ({
    barcode: this.barcode,
    carbohydrate: this.carbohydrate,
    energy: this.energy,
    fat: this.fat,
    fibre: this.fibre,
    id: this.id,
    monoUnsaturates: this.monoUnsaturates,
    name: this.name,
    polyols: this.polyols,
    polyunsaturates: this.polyunsaturates,
    protein: this.protein,
    salt: this.salt,
    saturates: this.saturates,
    starch: this.starch,
    sugars: this.sugars,
    unit: this.unit
  });
}
