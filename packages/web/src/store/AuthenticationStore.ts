import { action, autorun, computed, flow, observable } from "mobx";

import { Rpc } from "../utility/rpc";
import { RootStore } from "./RootStore";
import { Store } from "./Store";

/**
 * Local storage key where authentication token is stored.
 */
const AUTHENTICATION_TOKEN_KEY = "token";

/**
 * Authentication credentials store.
 */
export class AuthenticationStore extends Store {
  /**
   * Authentication token.
   */
  @observable private token?: string;

  /**
   * Creates a new instance of `AuthenticationStore`.
   */
  public constructor(rootStore: RootStore) {
    super(rootStore);

    this.token = localStorage.getItem(AUTHENTICATION_TOKEN_KEY) || undefined;

    autorun(() => {
      if (this.token === undefined) {
        localStorage.removeItem("token");
      } else {
        localStorage.setItem("token", this.token);
      }
    });
  }

  /**
   * Clears all data stored in this store.
   */
  @action
  public clear() {
    this.token = undefined;
  }

  /**
   * Returns whether or not user is authenticated.
   */
  @computed
  public get authenticated() {
    return this.token !== undefined;
  }

  /**
   * Sets authentication token to specified value.
   */
  @action
  public setCurrentAccount(token: string) {
    this.token = token;
  }

  /**
   * Returns `Authorization` header field value or `undefined`, if user is not
   * authenticated.
   */
  @computed
  public get authorization() {
    if (this.token === undefined) {
      return undefined;
    }

    return `Bearer ${this.token}`;
  }

  /**
   * Logs account in using specified credentials. Returned error is handled by
   * `Login` scene component.
   */
  public login = flow(function* login(
    this: AuthenticationStore,
    email: string,
    password: string
  ) {
    const result = yield Rpc.call("authentication", "generateToken", {
      email,
      password
    });

    if (!result.ok) {
      return result.value;
    }

    this.token = result.value.token;
    this.rootStore.accounts.setCurrentAccount(result.value.account);

    return undefined;
  });

  /**
   * Logs current account out by clearing all stores.
   */
  public logout() {
    this.rootStore.clear();
  }
}
