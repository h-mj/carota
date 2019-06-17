import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";

import { Enum, Language, AccountType, AccountRights } from "../types";

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

  @ManyToOne(() => Account)
  public adviser?: Account;

  @ManyToOne(() => Account)
  public inviter?: Account;

  @Column("enum", { enum: AccountTypeEnum })
  public type!: AccountType;

  @Column("enum", { enum: AccountRightsEnum })
  public rights!: AccountRights;
}
