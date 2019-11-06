import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { DtoOf } from "../../utility/types";
import { Account, RIGHTS, Rights, Type, TYPES } from "../account/Account";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column("enum", { enum: TYPES })
  public type!: Type;

  @Column("enum", { enum: RIGHTS })
  public rights!: Rights;

  @ManyToOne(() => Account)
  public adviser?: Account;

  @ManyToOne(() => Account)
  public inviter?: Account;

  public toDto = async () => ({
    id: this.id,
    type: this.type,
    rights: this.rights
  });
}

export type InvitationDto = DtoOf<Invitation>;
