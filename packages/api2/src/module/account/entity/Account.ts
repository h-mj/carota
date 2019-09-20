import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export const LANGUAGES = ["English", "Estonian", "Russian"] as const;
export type Languages = typeof LANGUAGES[number];

export const ACCOUNT_TYPES = ["Adviser", "Default"] as const;
export type AccountTypes = typeof ACCOUNT_TYPES[number];

export const ACCOUNT_RIGHTS = ["All", "Default"] as const;
export type AccountRights = typeof ACCOUNT_RIGHTS[number];

export const SEXES = ["Female", "Male"] as const;
export type Sexes = typeof SEXES[number];

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public name!: string;

  @Column("enum", { enum: LANGUAGES })
  public language!: Languages;

  @Column("enum", { enum: SEXES, nullable: true })
  public sex!: Sexes;

  @Column("date", { nullable: true })
  public dateOfBirth!: string;

  @Column({ unique: true })
  public email!: string;

  @Column()
  public hash!: string;

  @ManyToOne(() => Account)
  public adviser!: Account | null;

  @ManyToOne(() => Account)
  public inviter!: Account | null;

  @Column("enum", { enum: ACCOUNT_TYPES })
  public type!: AccountTypes;

  @Column("enum", { enum: ACCOUNT_RIGHTS })
  public rights!: AccountRights;

  public toDto = () => ({
    id: this.id,
    name: this.name,
    language: this.language,
    email: this.email,
    type: this.type,
    rights: this.rights
  });
}

export type AccountDto = ReturnType<Account["toDto"]>;
