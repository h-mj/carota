import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { AccountRights, AccountTypes } from "../types";
import { Account, AccountRightsEnum, AccountTypesEnum } from "./Account";

@Entity()
export class Invitation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToOne(() => Account)
  public adviser?: Account;

  @ManyToOne(() => Account)
  public inviter?: Account;

  @Column("enum", { enum: AccountTypesEnum })
  public type!: AccountTypes;

  @Column("enum", { enum: AccountRightsEnum })
  public rights!: AccountRights;
}
