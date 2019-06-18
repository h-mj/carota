import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { AccountRights, AccountType } from "../types";
import { Account, AccountRightsEnum, AccountTypeEnum } from "./Account";

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
