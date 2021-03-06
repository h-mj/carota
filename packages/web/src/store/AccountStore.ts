import { action, observable } from "mobx";
import { AccountDto, Body, Language } from "server";

import { Account } from "../model/Account";
import { Group } from "../model/Group";
import { Rpc } from "../utility/rpc";
import { CachedStore } from "./CachedStore";

/**
 * Account managing store.
 */
export class AccountStore extends CachedStore<Account> {
  /**
   * Currently authenticated account.
   */
  @observable public current?: Account;

  /**
   * Loads currently authenticated account.
   */
  public async initialize() {
    if (!this.rootStore.authenticationStore.authenticated) {
      return;
    }

    const result = await Rpc.call("account", "getCurrent", {});

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
      return;
    }

    this.setCurrentAccount(result.value);
  }

  /**
   * Clears all the data this store holds.
   */
  public clear() {
    super.clear();

    this.current = undefined;
  }

  /**
   * Sets current account to an account based on specified data transfer object.
   */
  @action
  public setCurrentAccount(dto: AccountDto) {
    this.current = new Account(dto, undefined, this);
    this.rootStore.viewStore.language = dto.language;
  }

  /**
   * Inserts specified `account` into specified `group` at given `index`.
   */
  public async insert(account: Account, group: Group, index: number) {
    if (account.group !== undefined) {
      const { accounts } = account.group;
      accounts.splice(accounts.indexOf(account), 1);
    }

    group.accounts.splice(index, 0, account);
    account.group = group;

    const result = await Rpc.call("account", "insert", {
      id: account.id,
      groupId: group.id,
      index,
    });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
    }
  }

  /**
   * Sets the language of currently authenticated account.
   */
  @action
  public async setLanguage(language: Language) {
    this.rootStore.viewStore.language = language;

    const result = await Rpc.call("account", "setLanguage", { language });

    if (!result.ok) {
      this.rootStore.viewStore.notifyUnknownError();
    }
  }

  /**
   * Creates a new account with specified information and automatically logs
   * newly created account in.
   */
  public async create(body: Body<"account", "create">) {
    const result = await Rpc.call("account", "create", body);

    if (!result.ok) {
      return result.value;
    }

    this.rootStore.authenticationStore.setCurrentAccount(result.value.token);
    this.setCurrentAccount(result.value.account);

    return undefined;
  }
}
