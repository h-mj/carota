import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { AccountRights, AccountType, Enum, Language } from "../types";

import { Person } from "./Person";

export const LanguageEnum: Enum<Language> = {
  English: "English",
  Estonian: "Estonian",
  Russian: "Russian"
};

export const AccountTypeEnum: Enum<AccountType> = {
  Adviser: "Adviser",
  Default: "Default"
};

export const AccountRightsEnum: Enum<AccountRights> = {
  All: "All",
  Default: "Default"
};

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public name!: string;

  @Column("enum", { enum: LanguageEnum })
  public language!: Language;

  @Column({ unique: true })
  public email!: string;

  @Column()
  public hash!: string;

  @OneToOne(() => Person)
  @JoinColumn()
  public person?: Person;

  @ManyToOne(() => Account)
  public adviser?: Account;

  @ManyToOne(() => Account)
  public inviter?: Account;

  @Column("enum", { enum: AccountTypeEnum })
  public type!: AccountType;

  @Column("enum", { enum: AccountRightsEnum })
  public rights!: AccountRights;
}
