import { Body, Controllers, Endpoints, Response } from "api";

import { rootStore } from "../store/RootStore";

/**
 * Makes a `POST` request to route `/api/${controller}/${endpoint}` with message
 * body as string version of parameter `body` object and returns response
 * message body as JSON.
 *
 * @param controller Controller name.
 * @param endpoint Controller endpoint name.
 * @param body Request body object which will be in request message body.
 */
export const post = async <
  TController extends Controllers,
  TEndpoint extends Endpoints<TController>
>(
  controller: TController,
  endpoint: TEndpoint,
  body: Body<TController, TEndpoint>
): Promise<Response<TController, TEndpoint>> => {
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

  return response.json();
};
