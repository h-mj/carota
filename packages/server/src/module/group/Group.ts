import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { DtoOf } from "../../utility/entities";
import { Account } from "../account/Account";

/**
 * Advisee group entity.
 */
@Entity()
export class Group {
  /**
   * Group identifier.
   */
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  /**
   * Group name.
   */
  @Column()
  public name!: string;

  /**
   * Promise of all accounts inside this group. Accounts may not be in correct
   * order.
   */
  @OneToMany(
    () => Account,
    account => account.group
  )
  public accounts!: Promise<Account[]>;

  /**
   * Promise of group owner account.
   */
  @ManyToOne(() => Account)
  public account!: Promise<Account>;

  /**
   * Group owner account identifier.
   */
  @Column()
  public accountId!: string;

  /**
   * Whether this group is currently linked to the group linked list.
   */
  @Column("boolean")
  public linked!: boolean;

  /**
   * Promise of previous group in the group linked list. If the group is the
   * first in the list or the group is currently unlinked, promise resolves to
   * `undefined`.
   */
  @OneToOne(
    () => Group,
    group => group.next
  )
  public previous!: Promise<Group | undefined>;

  /**
   * Promise of next group in the group linked list. If the group is the last in
   * the list or the group is currently unlinked, promise resolves to `undefined`.
   */
  @OneToOne(
    () => Group,
    group => group.previous
  )
  @JoinColumn()
  public next!: Promise<Group | undefined>;

  /**
   * Identifier of the next group in the linked list. If this group is the last
   * in the list or this group is currently unlinked, the value is `null`.
   */
  @Column({ nullable: true })
  public nextId!: string | null;

  /**
   * Returns the promise of data transfer object of this entity.
   */
  public toDto = async () => ({
    id: this.id,
    name: this.name,
    accounts: await Promise.all(
      (await this.accounts).map(account => account.toDto())
    )
  });
}

/**
 * Group data transfer object type.
 */
export type GroupDto = DtoOf<Group>;
