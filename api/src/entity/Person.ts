import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Enum, Sex } from "../types";

export const SexEnum: Enum<Sex> = {
  Female: "Female",
  Male: "Male"
};

@Entity()
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column("enum", { enum: SexEnum })
  public sex!: Sex;

  @Column("date")
  public dateOfBirth!: string;
}
