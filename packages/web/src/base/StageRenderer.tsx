import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { THEME_CONSTANTS } from "../styling/theme";
import { Component } from "./Component";
import { Scenes } from "./Scene";
import { SceneRenderer } from "./SceneRenderer";

/**
 * Component responsible for rendering all scenes.
 */
@inject("viewStore")
@observer
export class StageRenderer extends Component {
  /**
   * Currently visible scenes.
   */
  @observable private visibleScenes: Array<Scenes>;

  /**
   * Creates a new instance of `StageRenderer` and initializes array of visible
   * scenes.
   */
  public constructor(props: {}) {
    super(props);
    this.visibleScenes = this.props.viewStore!.scenes.slice();
  }

  /**
   * Updates array of visible scenes.
   */
  public componentDidUpdate() {
    const { scenes } = this.props.viewStore!;

    for (const scene of scenes) {
      if (!this.visibleScenes.includes(scene)) {
        this.visibleScenes.push(scene);
      }
    }

    for (const scene of this.visibleScenes) {
      if (!scenes.includes(scene)) {
        this.fadeScene(scene);
      }
    }
  }

  /**
   * Renders a `SceneRenderer` component for each visible scene.
   */
  public render() {
    const { scenes } = this.props.viewStore!;

    return this.visibleScenes.map(scene => (
      <SceneRenderer
        key={scene.name}
        active={scenes.includes(scene)}
        isFirst={scene === scenes[0]}
        isLast={scene === scenes[scenes.length - 1]}
        scene={scene}
      />
    ));
  }

  /**
   * Removes specified scene from visible scene array after a timeout.
   */
  private async fadeScene(scene: Scenes) {
    await this.props.viewStore!.wait(THEME_CONSTANTS.duration);

    const index = this.visibleScenes.indexOf(scene);

    if (index === -1) {
      return;
    }

    this.visibleScenes.splice(index, 1);
  }
}
