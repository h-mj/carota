import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { AccountRights, AccountTypes, InvitationData } from "../../types";
import { ACCOUNT_RIGHTS, ACCOUNT_TYPES, Account } from "./Account";

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
  public adviser!: Account | null;

  /**
   * Account which created this invitation. `undefined` if root account is
   * registered.
   */
  @ManyToOne(() => Account)
  public inviter!: Account | null;

  /**
   * Account type of future account.
   */
  @Column("enum", { enum: ACCOUNT_TYPES })
  public type!: AccountTypes;

  /**
   * Account rights of future account.
   */
  @Column("enum", { enum: ACCOUNT_RIGHTS })
  public rights!: AccountRights;

  /**
   * Creates `InvitationData` type object from this instance.
   */
  public toData = (): InvitationData => ({
    id: this.id,
    type: this.type,
    rights: this.rights
  });
}
