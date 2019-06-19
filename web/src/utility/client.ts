import { Body, Response, Route } from "api";
import { auth } from "../store/AuthStore";

/**
 * Makes a `POST` request to route `/api/${route}` with message body as string
 * version of `body` and returns response message body as JSON.
 *
 * @param route Request route.
 * @param body Request body which will be in request message body.
 */
export const post = async <TRoute extends Route>(
  route: TRoute,
  body: Body<TRoute>
): Promise<Response<TRoute>> => {
  const bodyString = JSON.stringify(body);
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const { authorization } = auth;

  if (authorization) {
    headers.append("Authorization", authorization);
  }

  const response = await fetch("/api" + route, {
    body: bodyString,
    headers,
    method: "POST"
  });

  return response.json();
};
