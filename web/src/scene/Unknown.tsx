import * as React from "react";
import { Scene } from "./Scene";
import { Error } from "../component/Error";

/**
 * Scene that is rendered if no other scenes match current URL.
 */
export class Unknown extends Scene<"Unknown"> {
  /**
   * Renders an unknown page error.
   */
  public render() {
    return <Error name="unknown" parameters={{}} />;
  }
}
