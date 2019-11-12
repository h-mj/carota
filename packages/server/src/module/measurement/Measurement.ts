import { Canallo } from "canallo";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";

import { onUnauthorized } from "../../utility/authorization";
import { DtoOf } from "../../utility/types";
import { isAccountOrAccountAdviser, Account } from "../account/Account";

export const SIZES = [
  "Biceps",
  "Calf",
  "Chest",
  "Height",
  "Hip",
  "Shin",
  "Thigh",
  "Thighs",
  "Waist",
  "Weight",
  "Wrist"
] as const;

export type Size = typeof SIZES[number];

@Entity()
@Unique(["account", "size", "date"])
export class Measurement {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToOne(() => Account, { nullable: false })
  public account!: Promise<Account>;

  @Column()
  public accountId!: string;

  @Column("enum", { enum: SIZES })
  public size!: Size;

  @Column("float4")
  public value!: number;

  @Column("date")
  public date!: string;

  public toDto = async () => ({
    id: this.id,
    size: this.size,
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
  .allow(Account, "get size measurements of", Account, isAccountOrAccountAdviser)
  .allow(Account, "delete", Measurement, isAccountMeasurementOwner);
