import { Canallo } from "canallo";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { onUnauthorized, or } from "../../utility/authorization";
import { DtoOf } from "../../utility/entities";
import { Group } from "../group/Group";

/**
 * Array of sexes.
 */
export const SEXES = ["Female", "Male"] as const;

/**
 * Union of sex values.
 */
export type Sex = typeof SEXES[number];

/**
 * Array of languages.
 */
export const LANGUAGES = ["English", "Estonian", "Russian"] as const;

/**
 * Union of language values.
 */
export type Language = typeof LANGUAGES[number];

/**
 * Array of account types.
 */
export const TYPES = ["Adviser", "Default"] as const;

/**
 * Union of account types.
 */
export type Type = typeof TYPES[number];

/**
 * Array of account rights.
 */
export const RIGHTS = ["All", "Default"] as const;

/**
 * Union of account rights.
 */
export type Rights = typeof RIGHTS[number];

/**
 * Account entity.
 */
@Entity()
export class Account {
  /**
   * Account identifier.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Account holder's name.
   */
  @Column()
  public name!: string;

  /**
   * Account holder's sex.
   */
  @Column("enum", { enum: SEXES })
  public sex!: Sex;

  /**
   * Account holder's birth date.
   */
  @Column("date")
  public birthDate!: string;

  /**
   * Account holder's display language.
   */
  @Column("enum", { enum: LANGUAGES })
  public language!: Language;

  /**
   * Account holder's email address.
   */
  @Column({ unique: true })
  public email!: string;

  /**
   * Hash of account holder's password.
   */
  @Column()
  public hash!: string;

  /**
   * Account type.
   */
  @Column("enum", { enum: TYPES })
  public type!: Type;

  /**
   * Account rights.
   */
  @Column("enum", { enum: RIGHTS })
  public rights!: Rights;

  /**
   * Promise of account adviser account. If account does not have an adviser,
   * promise resolves to `undefined`.
   */
  @ManyToOne(() => Account)
  public adviser!: Promise<Account | undefined>;

  /**
   * Account adviser account identifier. If account does not have an adviser,
   * this value is `null`.
   */
  @Column({ nullable: true })
  public adviserId!: string | null;

  /**
   * Promise of created advisee account groups of this account. Returned groups
   * may not be in correct order.
   */
  @OneToMany(
    () => Group,
    group => group.account
  )
  public groups!: Promise<Group[]>;

  /**
   * Promise of group this account is part of. If this account is not part of
   * any group, promise resolves to `undefined`.
   */
  @ManyToOne(() => Group)
  public group!: Promise<Group | undefined>;

  /**
   * Identifier of the group this account is part of. If this account is not
   * part of any group, this value is `null`.
   */
  @Column({ nullable: true })
  public groupId!: string | null;

  /**
   * Whether this account is currently linked to the group accounts linked list.
   */
  @Column("boolean")
  public linked!: boolean;

  /**
   * Promise of previous account in the group's accounts linked list.
   *
   * Promise resolves to `undefined` if at least one of the following is true:
   * - account is not part of any group;
   * - account is currently unlinked;
   * - account is the first account in the list.
   */
  @OneToOne(
    () => Account,
    account => account.next
  )
  public previous!: Promise<Group | undefined>;

  /**
   * Promise of next account in the group's accounts linked list.
   *
   * Promise resolves to `undefined` if at least one of the following is true:
   * - account is not part of any group;
   * - account is currently unlinked;
   * - account is the last account in the list.
   */
  @OneToOne(
    () => Account,
    account => account.previous
  )
  @JoinColumn()
  public next!: Promise<Account | undefined>;

  /**
   * Identifier of next account in the group's accounts linked list.
   *
   * This value is `null` if at least one of the following is true:
   * - account is not part of any group;
   * - account is currently unlinked;
   * - account is the last account in the list.
   */
  @Column({ nullable: true })
  public nextId!: string | null;

  /**
   * Promise of an account which created the invitation that was used to create
   * this account. Promise resolves to `undefined` if account was manually
   * created.
   */
  @ManyToOne(() => Account)
  public inviter!: Promise<Account | undefined>;

  /**
   * Identifier of an account which created the invitation that was used to
   * create this account. This value is `null` if account was manually created.
   */
  @Column({ nullable: true })
  public inviterId!: string | null;

  /**
   * Returns the promise of data transfer object of this entity.
   */
  public toDto = async () => ({
    id: this.id,
    name: this.name,
    sex: this.sex,
    birthDate: this.birthDate,
    language: this.language,
    email: this.email,
    type: this.type,
    rights: this.rights
  });
}

/**
 * Account data transfer object type.
 */
export type AccountDto = DtoOf<Account>;

/**
 * Returns whether `requester` account is the same account as `target` account.
 */
export const isAccount = (requester: Account, target: Account) =>
  requester.id === target.id;

/**
 * Returns whether `requester` account is the adviser of `target` account.
 */
export const isAdviser = (requester: Account, target: Account) =>
  requester.id === target.adviserId;

/**
 * Returns whether `requester` account is an administrator.
 */
export const isAdministrator = (requester: Account) =>
  requester.rights === "All";

/**
 * Account related authorization definitions.
 */
// prettier-ignore
export const { authorize } = new Canallo(onUnauthorized)
  .allow(Account, "get", Account, or(isAccount, isAdviser, isAdministrator))
  .allow(Account, "get groups of", Account, or(isAccount, isAdministrator))
  .allow(Account, "get meals of", Account, or(isAccount, isAdviser, isAdministrator))
  .allow(Account, "get measurements of", Account, or(isAccount, isAdviser, isAdministrator))
  .allow(Account, "insert into group", Account, isAdviser);
