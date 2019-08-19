import { Body } from "api";
import { action, autorun, computed, observable } from "mobx";

import { post } from "../utility/client";
import { RootStore } from "./RootStore";

/**
 * Store responsible for storing and updating account information of current user.
 */
export class AccountsStore {
  /**
   * JSON Web Token.
   */
  @observable private token?: string;

  /**
   * RootStore instance.
   */
  private rootStore: RootStore;

  /**
   * Creates a new instance of `AccountStore`.
   *
   * Assigns token inside `localStorage` to field `token` and creates an
   * `autorun` that updates token value inside `localStorage` any time field
   * `token` changes.
   */
  public constructor(rootStore: RootStore) {
    this.token = localStorage.getItem("token") || undefined;
    this.rootStore = rootStore;

    autorun(() => {
      if (this.token === undefined) {
        localStorage.removeItem("token");
      } else {
        localStorage.setItem("token", this.token);
      }
    });
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
   * Returns whether or not user is authenticated.
   */
  @computed
  public get authenticated() {
    return this.token !== undefined;
  }

  /**
   * Makes a `POST` request with given `body` to API signing in route and on
   * success assigns returned token to field `token` and returns `undefined` or
   * returns an `Error` object.
   *
   * @param body Login request message body.
   */
  @action
  public async login(body: Body<"account", "login">) {
    const response = await post("account", "login", body);

    if ("error" in response) {
      return response.error;
    }

    this.token = response.data.token;

    return undefined;
  }

  /**
   * Makes a `POST` request with given `body` to API registration route and on
   * success assigns returned token to field `token` and returns `undefined` or
   * returns an `Error` object.
   *
   * @param body Registration request message body.
   */
  @action
  public async register(body: Body<"account", "register">) {
    const response = await post("account", "register", body);

    if ("error" in response) {
      return response.error;
    }

    this.token = response.data.token;

    return undefined;
  }

  /**
   * Logs the user out by clearing all stores including this one.
   */
  @action
  public logout() {
    this.rootStore.clear();
  }

  /**
   * Clears all the data this store holds.
   */
  @action
  public clear() {
    this.token = undefined;
  }
}
