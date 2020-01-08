import { observable } from "mobx";
import { GroupDto } from "server";

import { GroupsStore } from "../store/GroupsStore";
import { Account } from "./Account";
import { Model } from "./Model";

/**
 * Client-side representation of `Group` entity.
 */
export class Group implements Model {
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
  @observable public readonly accounts: Account[];

  /**
   * Groups store instance.
   */
  private readonly store: GroupsStore;

  /**
   * Creates a new instance of `Group` model based on the data transfer object.
   */
  public constructor(dto: GroupDto, store: GroupsStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.accounts = dto.accounts.map(
      dto => new Account(dto, this, store.rootStore.accounts)
    );
    this.store = store;

    this.store.register(this);
  }

  /**
   * Inserts this group at specified `index` inside account advisee group list.
   */
  public insert(index: number) {
    return this.store.insert(this, index);
  }
}
