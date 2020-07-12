import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { DtoOf } from "../../utility/entities";
import { Account, RIGHTS, Rights, Type, TYPES } from "../account/Account";

@Entity()
export class Invitation {
  /**
   * Invitation identifier.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Future created account type.
   */
  @Column("enum", { enum: TYPES })
  public type!: Type;

  /**
   * Future created account rights.
   */
  @Column("enum", { enum: RIGHTS })
  public rights!: Rights;

  /**
   * Promise of future account adviser account. If future account will not have an adviser,
   * promise resolves to `undefined`.
   */
  @ManyToOne(() => Account)
  public adviser!: Promise<Account | undefined>;

  /**
   * Future account adviser account identifier. If future account will not have
   * an adviser, this value is `null`.
   */
  @Column({ nullable: true })
  public adviserId!: string | null;

  /**
   * Promise of an account which created this invitation. Promise resolves to
   * `undefined` if invitation was created manually.
   */
  @ManyToOne(() => Account)
  public inviter?: Promise<Account | undefined>;

  /**
   * Identifier of an account which created this invitation. This value is
   * `null` if invitation was created manually.
   */
  @Column({ nullable: true })
  public inviterId!: string | null;

  /**
   * Returns the promise of data transfer object of this entity.
   */
  public toDto = async () => ({
    id: this.id,
    type: this.type,
    rights: this.rights,
  });
}

/**
 * Invitation data transfer object type.
 */
export type InvitationDto = DtoOf<Invitation>;
