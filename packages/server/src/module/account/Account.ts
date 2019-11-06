import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { DtoOf } from "../../utility/types";

export const SEXES = ["Female", "Male"] as const;
export type Sex = typeof SEXES[number];

export const LANGUAGES = ["English", "Estonian", "Russian"] as const;
export type Language = typeof LANGUAGES[number];

export const TYPES = ["Adviser", "Default"] as const;
export type Type = typeof TYPES[number];

export const RIGHTS = ["All", "Default"] as const;
export type Rights = typeof RIGHTS[number];

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public name!: string;

  @Column("enum", { enum: SEXES })
  public sex!: Sex;

  @Column("date")
  public birthDate!: string;

  @Column("enum", { enum: LANGUAGES })
  public language!: Language;

  @Column({ unique: true })
  public email!: string;

  @Column()
  public hash!: string;

  @Column("enum", { enum: TYPES })
  public type!: Type;

  @Column("enum", { enum: RIGHTS })
  public rights!: Rights;

  @ManyToOne(() => Account)
  public adviser?: Account;

  @Column({ nullable: true })
  public adviserId!: string | null;

  @ManyToOne(() => Account)
  public inviter?: Account;

  @Column({ nullable: true })
  public inviterId!: string | null;

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

export type AccountDto = DtoOf<Account>;
