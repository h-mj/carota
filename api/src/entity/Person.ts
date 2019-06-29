import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Enum, Sexes } from "../../types";

/**
 * Object that is used as sex enumeration.
 */
export const SexesEnum: Enum<Sexes> = {
  Female: "Female",
  Male: "Male"
};

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
  @Column("enum", { enum: SexesEnum })
  public sex!: Sexes;

  /**
   * Person's date of birth.
   */
  @Column("date")
  public dateOfBirth!: string;
}
