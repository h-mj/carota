import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Person } from "./Person";

/**
 * Array of valid languages.
 */
export const LANGUAGES = ["English", "Estonian", "Russian"] as const;

/**
 * Union of valid languages.
 */
export type Languages = typeof LANGUAGES[number];

/**
 * Array of valid account types.
 */
export const ACCOUNT_TYPES = ["Adviser", "Default"] as const;

/**
 * Union of valid account types.
 */
export type AccountTypes = typeof ACCOUNT_TYPES[number];

/**
 * Array of valid account rights.
 */
export const ACCOUNT_RIGHTS = ["All", "Default"] as const;

/**
 * Union of valid account rights.
 */
export type AccountRights = typeof ACCOUNT_RIGHTS[number];

/**
 * Application account which is used to save registered users and verify them on
 * login.
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
  @Column("enum", { enum: LANGUAGES })
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
  public person!: Person | null;

  /**
   * Advisers account. `undefined` if account owner doesn't have an adviser.
   */
  @ManyToOne(() => Account)
  public adviser!: Account | null;

  /**
   * Account who created the invitation using which this account was registered.
   * `undefined` if root account.
   */
  @ManyToOne(() => Account)
  public inviter!: Account | null;

  /**
   * Account type, which can be following:
   * - `Adviser` type accounts can invite advisees and advise them.
   * - `Default` type accounts cannot invite other users nor advise other users.
   */
  @Column("enum", { enum: ACCOUNT_TYPES })
  public type!: AccountTypes;

  /**
   * Account rights.
   */
  @Column("enum", { enum: ACCOUNT_RIGHTS })
  public rights!: AccountRights;
}
