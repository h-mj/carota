import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Loading } from "./icon/Loading";
import { Overlay } from "./Overlay";
import { InjectedProps } from "../store/Store";
import { DURATION, fadeIn, fadeOut } from "../styling/animations";
import { LIGHT } from "../styling/light";

/**
 * Component that is shown when some part of the application is being loaded.
 */
@inject("views")
@observer
export class Loader extends React.Component<InjectedProps> {
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
  public componentWillUpdate() {
    const { waiting } = this.props.views!;

    // If we were loading but not anymore, fade out.
    if (this.previousIsLoading && !waiting) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(this.hide, 1000 * DURATION);
    }

    this.previousIsLoading = waiting;
  }

  /**
   * Renders loader component.
   */
  public render() {
    const { waiting } = this.props.views!;

    if (waiting || this.timeoutId !== 0) {
      return (
        <LoaderOverlay isActive={waiting}>
          <Loading />
        </LoaderOverlay>
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
 * Loader overlay component props.
 */
interface LoaderOverlayProps {
  /**
   * Whether or not loading is active.
   */
  isActive: boolean;
}

/**
 * Extended `Overlay` component that fades in and out and allows user to click
 * though it if fading out.
 */
const LoaderOverlay = styled(Overlay)<LoaderOverlayProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${LIGHT.overlayBackgroundColor};

  animation: ${props => (props.isActive ? fadeIn : fadeOut)} ${DURATION}s
    forwards;

  /* Don't let users select components below the overlay */
  user-select: ${props => (props.isActive ? "auto" : "none")};
  pointer-events: ${props => (props.isActive ? "initial" : "none")};
`;
