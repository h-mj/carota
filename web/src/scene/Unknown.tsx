import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Alert } from "../component/Alert";

/**
 * Scene that is rendered if no other scenes match current URL.
 */
export class Unknown extends SceneComponent<"Unknown"> {
  /**
   * Sets the name of this scene.
   */
  public constructor(props: DefaultSceneComponentProps<"Unknown">) {
    super("Unknown", props);
  }

  /**
   * Renders an unknown page error.
   */
  public render() {
    return <Alert name="unknown" parameters={{}} />;
  }
}
