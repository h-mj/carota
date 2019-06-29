import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Loading } from "./icon/Loading";
import { fadeIn, fadeOut, TRANSITION_DURATION } from "../styling/animations";
import { BACKGROUND_TRANSLUCENT } from "../styling/colors";

/**
 * Loader component props.
 */
interface LoaderProps {
  /**
   * Whether or not something is loading.
   */
  isLoading: boolean;
}

/**
 * Component that is shown when some part of the application is being loaded.
 */
@observer
export class Loader extends React.Component<LoaderProps> {
  /**
   * Timeout ID that sets `timeoutId` back to `0`.
   */
  @observable private timeoutId = 0;

  /**
   * Previous value of `isLoading` prop.
   */
  private previousIsLoading = false;

  /**
   * Sets fade out timeout if needed and updates `previousIsLoading` value.
   */
  public componentWillUpdate(props: LoaderProps) {
    const { isLoading } = props;

    // If we were loading but not anymore, fade out.
    if (this.previousIsLoading && !isLoading) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(this.hide, 1000 * TRANSITION_DURATION);
    }

    this.previousIsLoading = isLoading;
  }

  /**
   * Renders loader component.
   */
  public render() {
    if (this.props.isLoading || this.timeoutId !== 0) {
      return (
        <Overlay isActive={this.props.isLoading}>
          <Loading />
        </Overlay>
      );
    }

    return null;
  }

  /**
   * Resets `timeoutId` back to `0`.
   */
  @action
  private hide = () => {
    this.timeoutId = 0;
  };
}

/**
 * Overlay component props.
 */
interface OverlayProps {
  /**
   * Whether or not loading is active.
   */
  isActive: boolean;
}

/**
 * Component that fills entire container and displays its children in the middle
 * of the component.
 */
const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${BACKGROUND_TRANSLUCENT};

  animation: ${props => (props.isActive ? fadeIn : fadeOut)}
    ${TRANSITION_DURATION}s forwards;

  /* Don't let users select components below the overlay */
  user-select: ${props => (props.isActive ? "auto" : "none")};
  pointer-events: ${props => (props.isActive ? "initial" : "none")};
`;
