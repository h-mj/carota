import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { AccountRights, AccountTypes } from "../types";
import { Account, AccountRightsEnum, AccountTypesEnum } from "./Account";

/**
 * Model that is used to register new accounts and assign advisers, inviters,
 * account type and rights to created account.
 */
@Entity()
export class Invitation extends BaseEntity {
  /**
   * Invitation ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Adviser account of future account. `undefined` if account doesn't have an
   * adviser.
   */
  @ManyToOne(() => Account)
  public adviser?: Account;

  /**
   * Account which created this invitation. `undefined` if root account is
   * registered.
   */
  @ManyToOne(() => Account)
  public inviter?: Account;

  /**
   * Account type of future account.
   */
  @Column("enum", { enum: AccountTypesEnum })
  public type!: AccountTypes;

  /**
   * Account rights of future account.
   */
  @Column("enum", { enum: AccountRightsEnum })
  public rights!: AccountRights;
}
