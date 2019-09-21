import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

/**
 * Array of valid languages.
 */
export const LANGUAGES = ["English", "Estonian", "Russian"] as const;

/**
 * Union of valid languages.
 */
export type Languages = typeof LANGUAGES[number];

/**
 * Array of valid sexes.
 */
export const SEXES = ["Female", "Male"] as const;

/**
 * Union of valid sexes.
 */
export type Sexes = typeof SEXES[number];

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
   * Account holder's sex.
   */
  @Column("enum", { enum: SEXES, nullable: true })
  public sex!: Sexes | null;

  /**
   * Account holder's date of birth.
   */
  @Column("date", { nullable: true })
  public dateOfBirth!: string | null;

  /**
   * Account password hash.
   */
  @Column()
  public hash!: string;

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

  /**
   * Returns a representation of this model that will be transferred to the
   * client.
   */
  public toData = () => ({
    id: this.id,
    name: this.name,
    language: this.language,
    email: this.email,
    type: this.type,
    rights: this.rights
  });
}

/**
 * Account model data transfer object type.
 */
export type AccountData = ReturnType<Account["toData"]>;
