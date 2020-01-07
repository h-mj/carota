import { Canallo } from "canallo";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

import { onUnauthorized } from "../../utility/authorization";
import { DtoOf } from "../../utility/entities";
import { Account } from "../account/Account";

export const QUANTITIES = [
  "Bicep",
  "Calf",
  "Chest",
  "Height",
  "Hip",
  "Shin",
  "Thigh",
  "Waist",
  "Weight",
  "Wrist"
] as const;

export type Quantity = typeof QUANTITIES[number];

@Entity()
@Unique(["account", "quantity", "date"])
export class Measurement {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToOne(() => Account, { nullable: false })
  public account!: Promise<Account>;

  @Column()
  public accountId!: string;

  @Column("enum", { enum: QUANTITIES })
  public quantity!: Quantity;

  @Column("float4")
  public value!: number;

  @Column("date")
  public date!: string;

  public toDto = async () => ({
    id: this.id,
    quantity: this.quantity,
    value: this.value,
    date: this.date
  });
}

export type MeasurementDto = DtoOf<Measurement>;

const isAccountMeasurementOwner = (
  account: Account,
  measurement: Measurement
) => account.id === measurement.accountId;

// prettier-ignore
export const { authorize } = new Canallo(onUnauthorized)
  .allow(Account, "delete", Measurement, isAccountMeasurementOwner);
