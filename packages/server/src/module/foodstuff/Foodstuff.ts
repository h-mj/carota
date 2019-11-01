import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { allow, can } from "../../utility/authorization";
import { Account } from "../account/Account";
import { NutritionDeclaration } from "./NutritionDeclaration";

export const UNITS = ["g", "ml"] as const;
export type Unit = typeof UNITS[number];

@Entity()
export class Foodstuff {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public name!: string;

  @Column("text", { nullable: true, unique: true })
  public barcode!: string | null;

  @Column("enum", { enum: UNITS })
  public unit!: Unit;

  @Column("float", { nullable: true })
  public packageSize!: number | null;

  @Column("float", { nullable: true })
  public pieceQuantity!: number | null;

  @Column(() => NutritionDeclaration)
  public nutritionDeclaration!: NutritionDeclaration;

  @ManyToOne(() => Account, { nullable: false })
  public editor!: Account;

  @Column()
  public editorId!: string;

  public toDto = (principal: Account) => ({
    id: this.id,
    name: this.name,
    barcode: this.barcode || undefined,
    packageSize: this.packageSize || undefined,
    unit: this.unit,
    nutritionDeclaration: this.nutritionDeclaration.toDto(),
    pieceQuantity: this.pieceQuantity || undefined,
    deletable: can(principal, "delete", this),
    editable: can(principal, "save", this)
  });
}

export type FoodstuffDto = ReturnType<Foodstuff["toDto"]>;

// prettier-ignore
{
  allow(Account, "delete", Foodstuff, (account, foodstuff) => account.id === foodstuff.editorId || account.rights === "All");
  allow(Account, "save", Foodstuff, (account, foodstuff) => account.id === foodstuff.editorId || account.rights === "All");
}
