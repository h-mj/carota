import { Body } from "api";
import { autorun, computed, observable, action } from "mobx";
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
   * Creates a new instance of `AuthStore`.
   *
   * Assigns token inside `localStorage` to field `token` and creates an
   * `autorun` that updates token value inside `localStorage` any time field
   * `token` changes.
   */
  public constructor() {
    this.token = localStorage.getItem("token") || undefined;

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
   */
  @action
  public async login(body: Body<"/auth/login">) {
    const response = await post("/auth/login", body);

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
   */
  @action
  public async register(body: Body<"/auth/register">) {
    const response = await post("/auth/register", body);

    if ("error" in response) {
      return response.error;
    }

    this.token = response.data.token;

    return undefined;
  }

  /**
   * Assigns `undefined` to field `token` thus signing user out.
   */
  @action
  public logout() {
    this.token = undefined;
  }
}

/**
 * The only `AuthStore` class instance and which is provided to all components
 */
export const auth = new AuthStore();
