import { Languages } from "api";
import { action, autorun, computed, observable } from "mobx";
import { RootStore } from "./RootStore";
import { post } from "../utility/client";

/**
 * Store responsible for storing and updating JSON Web Token string used for
 * authentication on the server side.
 */
export class AuthStore {
  /**
   * JSON Web Token.
   */
  @observable private token?: string;

  /**
   * RootStore instance.
   */
  private rootStore: RootStore;

  /**
   * Creates a new instance of `AuthStore`.
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
  public async login(email: string, password: string) {
    const response = await post("auth", "login", { email, password });

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
  public async register(
    language: Languages,
    name: string,
    email: string,
    password: string,
    invitationId: string
  ) {
    const response = await post("auth", "register", {
      language,
      name,
      email,
      password,
      invitationId
    });

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
