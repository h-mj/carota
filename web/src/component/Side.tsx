import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { Overlay } from "./collection/container";
import { styled } from "../styling/theme";

/**
 * Component responsible for rendering side scene.
 */
@inject("views")
@observer
export class Side extends Component<"Side"> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: {}) {
    super("Side", props);
  }

  /**
   * Renders side scene container and the scene itself.
   */
  public render() {
    const { side } = this.props.views!;

    if (side === undefined) {
      return null;
    }

    return (
      <Overlay onClick={this.handleOverlayClick}>
        <Container>{side.render("side")}</Container>
      </Overlay>
    );
  }

  /**
   * Hides side scene when user clicks on the `Overlay` component.
   */
  @action
  private handleOverlayClick: React.MouseEventHandler<
    HTMLDivElement
  > = event => {
    if (event.target === event.currentTarget) {
      this.props.views!.refocus();
    }
  };
}

/**
 * Component that contains the side scene.
 */
const Container = styled.div`
  max-width: ${({ theme }) => theme.formWidth};
  width: 100%;
  height: 100%;

  overflow: auto;

  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.22);
`;
