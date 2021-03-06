import { computed, observable } from "mobx";

import { Account } from "../model/Account";
import { Group } from "../model/Group";
import { Rpc } from "../utility/rpc";
import { CachedStore } from "./CachedStore";

/**
 * Group managing store.
 */
export class GroupStore extends CachedStore<Group> {
  /**
   * Loaded advisee groups.
   */
  @observable private _groups?: Group[];

  /**
   * Loaded advisee accounts without a group.
   */
  @observable private _ungrouped?: Account[];

  /**
   * Whether advisee groups are being loaded.
   */
  @observable private loading = false;

  public clear() {
    super.clear();

    this._groups = undefined;
    this._ungrouped = undefined;
  }

  /**
   * Returns array of advisee groups of current account.
   */
  @computed
  public get groups() {
    if (this._groups === undefined) {
      this.load();
    }

    return this._groups ?? [];
  }

  /**
   * Returns array of advisee accounts of current account which are not in any
   * group.
   */
  @computed
  public get ungrouped() {
    if (this._ungrouped === undefined) {
      this.load();
    }

    return this._ungrouped ?? [];
  }

  /**
   * Loads advisee groups of current account.
   */
  private async load() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const result = await Rpc.call("group", "get", {
      accountId: this.rootStore.accountStore.current!.id,
    });

    if (result.ok) {
      const { ungrouped, groups } = result.value;

      this._groups = groups.map(
        (dto) => new Group(dto, this.rootStore.groupStore)
      );
      this._ungrouped = ungrouped.map(
        (dto) => new Account(dto, undefined, this.rootStore.accountStore)
      );
    } else {
      this._groups = [];
      this._ungrouped = [];

      this.rootStore.viewStore.notifyUnknownError();
    }

    this.loading = false;

    return;
  }

  /**
   * Creates a new group with specified name.
   */
  public async create(name: string) {
    const result = await Rpc.call("group", "create", { name });

    if (!result.ok) {
      return result.value;
    }

    if (this._groups !== undefined) {
      this._groups.push(new Group(result.value, this));
    }

    return;
  }

  /**
   * Deletes specified group.
   */
  public async delete(group: Group) {
    if (group.accounts.length > 0) {
      throw new Error("Tried to remove non-empty group");
    }

    const result = await Rpc.call("group", "delete", { id: group.id });

    if (!result.ok) {
      return this.rootStore.viewStore.notifyUnknownError();
    }

    if (this._groups !== undefined && this._groups.includes(group)) {
      this._groups.splice(this._groups.indexOf(group), 1);
    }

    this.unregister(group);
  }

  /**
   * Inserts specified `group` at specified `index` in adviser advisee group
   * list.
   */
  public async insert(group: Group, index: number) {
    if (this._groups !== undefined) {
      this._groups.splice(this.groups.indexOf(group), 1);
      this._groups.splice(index, 0, group);
    }

    const result = await Rpc.call("group", "insert", { id: group.id, index });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
    }
  }

  /**
   * Renames specified `group` to specified `name`.
   */
  public async rename(group: Group, name: string) {
    const result = await Rpc.call("group", "rename", { id: group.id, name });

    if (!result.ok) {
      return result.value;
    }

    group.name = name;

    return;
  }
}
