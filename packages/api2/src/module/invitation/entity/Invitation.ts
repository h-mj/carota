import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import {
  Account,
  ACCOUNT_RIGHTS,
  ACCOUNT_TYPES,
  AccountRights,
  AccountTypes
} from "../../account/entity/Account";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

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
    type: this.type,
    rights: this.rights
  });
}

export type InvitationDto = ReturnType<Invitation["toDto"]>;
