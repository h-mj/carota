import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { Loading } from "./icon/Loading";
import { Overlay } from "./container/Overlay";
import { DURATION, fadeIn, fadeOut } from "../styling/animations";
import { styled } from "../styling/theme";

/**
 * Component that is shown when some part of the application is being loaded.
 */
@inject("views")
@observer
export class Loader extends Component {
  /**
   * ID of a timeout that sets `timeoutId` back to `0`.
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
    const { loading } = this.props.views!;

    // If we were loading but not anymore, fade out.
    if (this.previousIsLoading && !loading) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(this.hide, 1000 * DURATION);
    }

    this.previousIsLoading = loading;
  }

  /**
   * Renders loader component.
   */
  public render() {
    const { loading } = this.props.views!;

    if (loading || this.timeoutId !== 0) {
      return (
        <LoaderOverlay isActive={loading}>
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

  background-color: ${({ theme }) => theme.overlayBackgroundColor};

  animation: ${props => (props.isActive ? fadeIn : fadeOut)} ${DURATION}s
    forwards;

  /* Don't let users select components below the overlay */
  user-select: ${props => (props.isActive ? "auto" : "none")};
  pointer-events: ${props => (props.isActive ? "initial" : "none")};
`;
