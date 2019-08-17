import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { DURATION, fadeIn, fadeOut } from "../styling/animations";
import { styled } from "../styling/theme";
import { Loading } from "./collection/icons";
import { Overlay } from "./Overlay";

/**
 * Component that is shown when ViewsStore.load` function is awaiting some
 * promise.
 */
@inject("views")
@observer
export class LoadingOverlay extends Component {
  /**
   * Whether or not loading overlay is visible.
   */
  @observable private visible = false;

  /**
   * ID of a timeout that sets visibility to `false`.
   */
  private timeoutId?: number;

  /**
   * Creates a new instance of `Loader`, sets its name and updates loading
   * state.
   */
  public constructor(props: {}) {
    super(props);
    this.update();
  }

  /**
   * Updates loading component on component update.
   */
  @action
  public componentDidUpdate() {
    this.update();
  }

  /**
   * Sets fade out timeout if needed and updates `previousIsLoading` value.
   */
  @action
  private update() {
    const { loading } = this.props.views!;

    if (loading) {
      this.visible = true;
    } else if (this.visible) {
      // If component was visible and loading stopped, set timeout that will set
      // visible to `false`.
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(this.hide, 1000 * DURATION);
    }
  }

  /**
   * Renders revolving disks inside an overlay component.
   */
  public render() {
    const { loading } = this.props.views!;

    if (!this.visible) {
      return null;
    }

    return (
      <Container active={loading}>
        <Loading />
      </Container>
    );
  }

  /**
   * Resets `timeoutId` back to `undefined`.
   */
  @action
  private hide = () => {
    this.visible = false;
  };
}

/**
 * Loader container component props.
 */
interface Container {
  /**
   * Whether or not loading is active.
   */
  active: boolean;
}

/**
 * Extended `Overlay` component that fades in and out and allows user to click
 * though it if fading its out.
 */
const Container = styled(Overlay)<Container>`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.translucentBackgroundColor};

  animation: ${props => (props.active ? fadeIn : fadeOut)} ${DURATION}s forwards;

  /* Don't let users select components below the overlay */
  user-select: ${props => (props.active ? "auto" : "none")};
  pointer-events: ${props => (props.active ? "initial" : "none")};
`;
