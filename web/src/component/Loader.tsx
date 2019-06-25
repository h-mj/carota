import { observable, action } from "mobx";
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
   * Whether or not loader should be visible.
   */
  @observable private isVisible: boolean = false;

  /**
   * Timeout ID that sets visibility to false after some timeout.
   */
  private timeoutId: number = 0;

  /**
   * Renders loader component.
   */
  public render() {
    const { isLoading: loading } = this.props;

    if (loading) {
      this.isVisible = true;
      window.clearTimeout(this.timeoutId);
      this.timeoutId = 0;
    } else if (this.isVisible) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(this.hide, 1000 * TRANSITION_DURATION);
    }

    if (!this.isVisible) {
      return null;
    }

    return (
      <Overlay isActive={loading}>
        <Loading />
      </Overlay>
    );
  }

  /**
   * Sets visibility to false and resets timeout ID.
   */
  @action
  private hide = () => {
    this.isVisible = false;
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
