import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { AccountRights, AccountTypes, Enum, Languages } from "../types";

import { Person } from "./Person";

/**
 * Object that is used as language enumeration.
 */
export const LanguagesEnum: Enum<Languages> = {
  English: "English",
  Estonian: "Estonian",
  Russian: "Russian"
};

/**
 * Object that is used as account type enumeration.
 */
export const AccountTypesEnum: Enum<AccountTypes> = {
  Adviser: "Adviser",
  Default: "Default"
};

/**
 * Object that is used as account rights enumeration.
 */
export const AccountRightsEnum: Enum<AccountRights> = {
  All: "All",
  Default: "Default"
};

/**
 * Account database table.
 */
@Entity()
export class Account extends BaseEntity {
  /**
   * Account ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Account owners name.
   */
  @Column()
  public name!: string;

  /**
   * User interface language.
   */
  @Column("enum", { enum: LanguagesEnum })
  public language!: Languages;

  /**
   * Account owners email address.
   */
  @Column({ unique: true })
  public email!: string;

  /**
   * Account password hash.
   */
  @Column()
  public hash!: string;

  /**
   * Accounts person model instance.
   */
  @OneToOne(() => Person)
  @JoinColumn()
  public person?: Person;

  /**
   * Advisers account. `undefined` if account owner doesn't have an adviser.
   */
  @ManyToOne(() => Account)
  public adviser?: Account;

  /**
   * Account who created the invitation using which this account was registered.
   * `undefined` if root account.
   */
  @ManyToOne(() => Account)
  public inviter?: Account;

  /**
   * Account type, which can be following:
   * - `Adviser` type accounts can invite advisees and advise them.
   * - `Default` type accounts cannot invite other users nor advise other users.
   */
  @Column("enum", { enum: AccountTypesEnum })
  public type!: AccountTypes;

  /**
   * Account rights.
   */
  @Column("enum", { enum: AccountRightsEnum })
  public rights!: AccountRights;
}
