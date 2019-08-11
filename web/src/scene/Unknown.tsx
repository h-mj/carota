import * as React from "react";
import { DefaultSceneProps, Scene } from "./Scene";
import { Alert } from "../component/Alert";

/**
 * Scene that is rendered if no other scenes match current URL.
 */
export class Unknown extends Scene<"Unknown"> {
  /**
   * Sets the name of this scene.
   */
  public constructor(props: DefaultSceneProps<"Unknown">) {
    super("Unknown", props);
  }

  /**
   * Renders an unknown page error.
   */
  public render() {
    return <Alert name="unknown" parameters={{}} />;
  }
}
