import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Account } from "./Account";
import { NutritionDeclaration } from "./NutritionDeclaration";

/**
 * Array of valid food amount units.
 */
export const UNITS = ["g", "ml"] as const;

/**
 * Union of valid food amount units.
 */
export type Units = typeof UNITS[number];

/**
 * Entity that holds information about a specific foodstuff item.
 */
@Entity()
export class Foodstuff extends BaseEntity {
  /**
   * Food ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * The name of the foodstuff.
   */
  @Column()
  public name!: string;

  /**
   * Barcode of the foodstuff, if exists.
   */
  @Column("text", { nullable: true })
  public barcode!: string | null;

  /**
   * Serving unit.
   */
  @Column("enum", { enum: UNITS })
  public unit!: Units;

  /**
   * Foodstuff nutrition information.
   */
  @Column(() => NutritionDeclaration)
  public nutritionDeclaration!: NutritionDeclaration;

  /**
   * Quantity of one piece in units, `null` if one piece of the foodstuff does
   * not exists.
   */
  @Column("float", { nullable: true })
  public pieceQuantity!: number | null;

  /**
   * ID of editor account.
   */
  public editorId!: string;

  /**
   * Account of last user who edited this foodstuff.
   */
  @ManyToOne(() => Account, { nullable: false })
  public editor!: Account;

  /**
   * Returns a representation of this entity that will be transferred to the
   * client.
   */
  public toDto = () => ({
    id: this.id,
    name: this.name,
    barcode: this.barcode || undefined,
    unit: this.unit,
    nutritionDeclaration: this.nutritionDeclaration.toDto(),
    pieceQuantity: this.pieceQuantity || undefined
  });
}

/**
 * Foodstuff entity data transfer object type.
 */
export type FoodstuffDto = ReturnType<Foodstuff["toDto"]>;
