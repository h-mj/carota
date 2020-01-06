import { GroupDto } from "server";

import { GroupsStore } from "../store/GroupsStore";
import { Account } from "./Account";

/**
 * Client-side representation of `Group` entity.
 */
export class Group {
  /**
   * Group identifier.
   */
  public readonly id: string;

  /**
   * Group name.
   */
  public readonly name: string;

  /**
   * Array of account models within this group.
   */
  public readonly accounts: Account[];

  /**
   * Groups store instance.
   */
  // @ts-ignore
  private readonly store: GroupsStore;

  /**
   * Creates a new instance of `Group` model based on the data transfer object.
   */
  public constructor(dto: GroupDto, store: GroupsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.accounts = dto.accounts.map(
      dto => new Account(dto, store.rootStore.accounts)
    );
    this.store = store;
  }
}
