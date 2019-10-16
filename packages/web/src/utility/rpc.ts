import { Body, Controller, Endpoint, Response } from "server";

import { rootStore } from "../store/RootStore";

/**
 * Successful result type.
 */
export type Success<S> = { ok: true; value: S };

/**
 * Creates successful result with specified value.
 */
export const success = <S>(value: S): Success<S> => ({ ok: true, value });

/**
 * Unsuccessful result type.
 */
export type Failure<F> = { ok: false; value: F };

/**
 * Creates unsuccessful result with specified value.
 */
export const failure = <F>(value: F): Failure<F> => ({ ok: false, value });

/**
 * Class that implements remote procedure calling methods.
 */
export class Rpc {
  /**
   * Makes a post request to specified endpoint of specified controller with
   * request body set to stringified `body` object and returns the server
   * response.
   */
  public static async call<
    TController extends Controller,
    TEndpoint extends Endpoint<TController>
  >(
    controller: TController,
    endpoint: TEndpoint,
    body: Body<TController, TEndpoint>
  ) {
    const bodyString = JSON.stringify(body);
    const headers = new Headers();

    headers.append("Content-Type", "application/json");

    const { authorization } = rootStore.accounts;

    if (authorization) {
      headers.append("Authorization", authorization);
    }

    const response = await fetch(`/api/${controller}/${endpoint}`, {
      body: bodyString,
      headers,
      method: "POST"
    });

    const json: Response<TController, TEndpoint> = await response.json();

    return "error" in json ? failure(json.error) : success(json.data);
  }
}
