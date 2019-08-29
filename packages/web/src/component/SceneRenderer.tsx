import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { RenderPosition, Scenes } from "../base/Scene";
import { styled } from "../styling/theme";
import { Navigation } from "./Navigation";
import { Overlay } from "./Overlay";
import { TitleBar } from "./TitleBar";

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
    const { scene } = this.props;
    const { position } = scene;
    const Container = CONTAINERS[position];

    return (
      <SceneOverlay onClick={this.handleClick} position={position}>
        <Container>
          {this.props.views!.root === scene ? (
            <Navigation />
          ) : (
            <TitleBar onClose={this.pop} />
          )}
          {scene.render()}
        </Container>
      </SceneOverlay>
    );
  }

  /**
   * Pops rendered scene when user clicks on the overlay.
   */
  @action
  private handleClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.pop();
  };

  /**
   * Pops rendered scene from active scenes.
   */
  @action
  private pop = () => {
    this.props.views!.pop(this.props.scene);
  };
}

/**
 * Scene overlay props.
 */
interface SceneOverlayProps {
  /**
   * Scene rendering position.
   */
  position: RenderPosition;
}

/**
 * Extended overlay component that contains a scene component.
 */
const SceneOverlay = styled(Overlay)<SceneOverlayProps>`
  background-color: ${({ theme }) => theme.translucentBackgroundColor};

  display: flex;
  align-items: center;
  justify-content: ${({ position }) =>
    position === "main" ? "center" : position};
`;

/**
 * Container that is rendered on the whole screen.
 */
const Main = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Container that is rendered on the left of the screen.
 */
const Left = styled(Main)`
  max-width: ${({ theme }) => theme.formWidth};
`;

/**
 * Container that is rendered in the center of the screen.
 */
const Center = styled(Main)`
  max-width: ${({ theme }) => theme.formWidth};
  height: initial;
  border-radius: ${({ theme }) => theme.borderRadius};

  @media screen and (max-width: ${({ theme }) => theme.formWidth}) {
    height: 100%;
    border-radius: 0;
  }
`;

/**
 * Maps render positions to their wrapper container components.
 */
const CONTAINERS = {
  center: Center,
  left: Left,
  main: Main
};
