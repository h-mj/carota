import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Enum, Sexes } from "../types";

export const SexesEnum: Enum<Sexes> = {
  Female: "Female",
  Male: "Male"
};

@Entity()
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column("enum", { enum: SexesEnum })
  public sex!: Sexes;

  @Column("date")
  public dateOfBirth!: string;
}
