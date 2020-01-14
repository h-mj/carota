import { observable } from "mobx";
import { GroupDto } from "server";

import { GroupStore } from "../store/GroupStore";
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
  @observable public name: string;

  /**
   * Array of account models within this group.
   */
  @observable public readonly accounts: Account[];

  /**
   * Group store instance.
   */
  private readonly store: GroupStore;

  /**
   * Creates a new instance of `Group` model based on the data transfer object.
   */
  public constructor(dto: GroupDto, store: GroupStore) {
    this.id = dto.id;
    this.name = dto.name;
    this.accounts = dto.accounts.map(
      dto => new Account(dto, this, store.rootStore.accountStore)
    );
    this.store = store;

    this.store.register(this);
  }

  /**
   * Deletes this group.
   */
  public delete() {
    return this.store.delete(this);
  }

  /**
   * Inserts this group at specified `index` inside account advisee group list.
   */
  public insert(index: number) {
    return this.store.insert(this, index);
  }

  /**
   * Renames this group to specified `name`.
   */
  public rename(name: string) {
    return this.store.rename(this, name);
  }
}
