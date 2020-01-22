import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "./Component";
import { SceneRenderer } from "./SceneRenderer";

/**
 * Component responsible for rendering all scenes.
 */
@inject("viewStore")
@observer
export class StageRenderer extends Component {
  /**
   * Renders a `SceneRenderer` component for each visible scene.
   */
  public render() {
    const { scenes } = this.props.viewStore!;

    return scenes.map((scene, index) => (
      <SceneRenderer
        isFirst={index === 0}
        isLast={index === scenes.length - 1}
        scene={scene}
      />
    ));
  }
}
