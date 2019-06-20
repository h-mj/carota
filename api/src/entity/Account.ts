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

export const LanguagesEnum: Enum<Languages> = {
  English: "English",
  Estonian: "Estonian",
  Russian: "Russian"
};

export const AccountTypesEnum: Enum<AccountTypes> = {
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

  @Column("enum", { enum: LanguagesEnum })
  public language!: Languages;

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

  @Column("enum", { enum: AccountTypesEnum })
  public type!: AccountTypes;

  @Column("enum", { enum: AccountRightsEnum })
  public rights!: AccountRights;
}
