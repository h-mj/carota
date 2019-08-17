import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { SceneRenderer } from "./SceneRenderer";

/**
 * Component responsible for rendering all scenes.
 */
@inject("views")
@observer
export class Stage extends Component {
  /**
   * Renders all active scenes.
   */
  public render() {
    return this.props.views!.scenes.map(scene => (
      <SceneRenderer key={scene.name} scene={scene} />
    ));
  }
}
