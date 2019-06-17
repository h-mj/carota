import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";

import { AccountType, AccountRights } from "../types";
import { AccountTypeEnum, Account, AccountRightsEnum } from "./Account";

@Entity()
export class Invitation extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @ManyToOne(() => Account)
  public adviser?: Account;

  @ManyToOne(() => Account)
  public inviter?: Account;

  @Column("enum", { enum: AccountTypeEnum })
  public type!: AccountType;

  @Column("enum", { enum: AccountRightsEnum })
  public rights!: AccountRights;
}
