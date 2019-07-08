import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Overlay } from "./Overlay";
import { InjectedProps } from "../store/Store";
import { UNIT_HEIGHT } from "../styling/sizes";
import { styled } from "../styling/theme";

/**
 * Component responsible for rendering side stage.
 */
@inject("views")
@observer
export class Side extends React.Component<InjectedProps> {
  /**
   * Renders a navigation bar and main stage.
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
   * Hides side stage when user clicks of `Overlay` itself.
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
 * Component that contains the side stage.
 */
const Container = styled.div`
  max-width: ${8 * UNIT_HEIGHT}rem;
  width: 100%;
  height: 100%;

  overflow: auto;

  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.22);
`;
