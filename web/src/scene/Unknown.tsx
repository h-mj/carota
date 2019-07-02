import * as React from "react";
import { Scene } from "./Scene";
import { Alert } from "../component/Alert";

/**
 * Scene that is rendered if no other scenes match current URL.
 */
export class Unknown extends Scene<"Unknown"> {
  /**
   * Renders an unknown page error.
   */
  public render() {
    return <Alert name="unknown" parameters={{}} />;
  }
}
