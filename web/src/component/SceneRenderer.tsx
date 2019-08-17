import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";
import { styled } from "../styling/theme";
import { Navigation } from "./Navigation";
import { Overlay } from "./Overlay";

/**
 * Scene rendered props.
 */
interface SceneRendererProps {
  /**
   * Scene which will be rendered.
   */
  scene: Scenes;
}

/**
 * Component which is responsible for rendering a given scene.
 */
@inject("views")
@observer
export class SceneRenderer extends Component<SceneRendererProps> {
  /**
   * Renders the scene to correct position.
   */
  public render() {
    const { position } = this.props.scene;

    const Container = position === "left" ? Left : React.Fragment;

    return (
      <SceneOverlay translucent={position !== "center"}>
        <Container>
          {this.props.views!.root === this.props.scene && <Navigation />}
          {this.props.scene.render()}
        </Container>
      </SceneOverlay>
    );
  }
}

/**
 * Scene overlay props.
 */
interface SceneOverlayProps {
  /**
   * Whether or not overlay is translucent.
   */
  translucent: boolean;
}

/**
 * Extended overlay component that contains a scene component.
 */
const SceneOverlay = styled(Overlay)<SceneOverlayProps>`
  background-color: ${({ theme, translucent }) =>
    translucent ? theme.translucentBackgroundColor : theme.backgroundColor};
`;

/**
 * Component that is rendered on the left of the screen.
 */
const Left = styled.div`
  max-width: ${({ theme }) => theme.formWidth};
  width: 100%;
  height: 100%;

  overflow: auto;

  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.22);
`;
