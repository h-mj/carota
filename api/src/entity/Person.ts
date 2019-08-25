import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Account } from "./Account";

/**
 * Array of valid sexes.
 */
export const SEXES = ["Female", "Male"] as const;

/**
 * Union of valid sexes.
 */
export type Sexes = typeof SEXES[number];

/**
 * Model that holds unchanging information about account users body used to
 * calculate daily calorie and nutrient amounts.
 */
@Entity()
export class Person extends BaseEntity {
  /**
   * Person ID.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Person's sex.
   */
  @Column("enum", { enum: SEXES })
  public sex!: Sexes;

  /**
   * Person's date of birth.
   */
  @Column("date")
  public dateOfBirth!: string;

  /**
   * Person's account.
   */
  @OneToOne(() => Account, { nullable: false })
  public account!: Account;
}
