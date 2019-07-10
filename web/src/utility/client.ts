import { Actions, Body, Controllers, Response } from "api";
import { rootStore } from "../store/RootStore";

/**
 * Makes a `POST` request to route `/api/${controller}/${action}` with message
 * body as string version of parameter `body` and returns response message body
 * as JSON.
 *
 * @param controller Controller name.
 * @param action Controllers action name.
 * @param body Request body object which will be in request message body.
 */
export const post = async <
  TController extends Controllers,
  TAction extends Actions<TController>
>(
  controller: TController,
  action: TAction,
  body: Body<TController, TAction>
): Promise<Response<TController, TAction>> => {
  const bodyString = JSON.stringify(body);
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const { authorization } = rootStore.auth;

  if (authorization) {
    headers.append("Authorization", authorization);
  }

  const response = await fetch(`/api/${controller}/${action}`, {
    body: bodyString,
    headers,
    method: "POST"
  });

  return response.json();
};
