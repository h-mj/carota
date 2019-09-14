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
    const { scenes } = this.props.views!;

    return scenes.map((scene, index) => (
      <SceneRenderer
        key={`${scene.name}:${index}`}
        first={index === 0}
        overlaid={index !== scenes.length - 1}
        scene={scene}
      />
    ));
  }
}
