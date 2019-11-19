import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { DtoOf } from "../../utility/entities";
import { Account, Rights, RIGHTS, Type, TYPES } from "../account/Account";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column("enum", { enum: TYPES })
  public type!: Type;

  @Column("enum", { enum: RIGHTS })
  public rights!: Rights;

  @ManyToOne(() => Account)
  public adviser!: Promise<Account | undefined>;

  @Column({ nullable: true })
  public adviserId!: string | null;

  @ManyToOne(() => Account)
  public inviter?: Promise<Account | undefined>;

  @Column({ nullable: true })
  public inviterId!: string | null;

  public toDto = async () => ({
    id: this.id,
    type: this.type,
    rights: this.rights
  });
}

export type InvitationDto = DtoOf<Invitation>;
