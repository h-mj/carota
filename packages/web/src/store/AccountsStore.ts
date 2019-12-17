import { action, observable } from "mobx";
import { AccountDto, Body, Language } from "server";

import { Account } from "../model/Account";
import { Rpc } from "../utility/rpc";
import { RootStore } from "./RootStore";

/**
 * Account managing store.
 */
export class AccountsStore {
  /**
   * Currently authenticated account.
   */
  @observable public current?: Account;

  /**
   * RootStore instance.
   */
  private rootStore: RootStore;

  /**
   * Creates a new instance of `AccountStore`.
   */
  public constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  /**
   * Clears all the data this store holds.
   */
  public clear() {
    this.current = undefined;
  }

  /**
   * Initializes current account using specified data transfer object.
   */
  @action
  public initialize(dto: AccountDto) {
    this.current = new Account(dto);
    this.rootStore.views.language = dto.language;
  }

  /**
   * Creates a new account with specified information and automatically logs
   * newly created account in.
   */
  public async register(body: Body<"account", "create">) {
    const response = await Rpc.call("account", "create", body);

    if (!response.ok) {
      return response.value;
    }

    this.rootStore.authentication.initialize(response.value.token);
    this.initialize(response.value.account);

    return undefined;
  }

  /**
   * Sets the language of currently authenticated account.
   */
  @action
  public async setLanguage(language: Language) {
    this.rootStore.views.language = language;

    const response = await Rpc.call("account", "setLanguage", { language });

    if (!response.ok) {
      this.rootStore.views.notifyUnknownError();
    }
  }

  /**
   * Loads currently authenticated account.
   */
  public async load() {
    if (!this.rootStore.authentication.authenticated) {
      return;
    }

    const response = await Rpc.call("account", "getCurrent", {});

    if (!response.ok) {
      this.rootStore.views.notifyUnknownError();
      return;
    }

    this.initialize(response.value);
  }
}
