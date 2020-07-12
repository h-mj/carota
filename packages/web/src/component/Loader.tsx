import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { fadeIn, fadeOut } from "../styling/animations";
import { styled, THEME_CONSTANTS } from "../styling/theme";
import { Loading } from "./collection/icons";
import { Overlay } from "./Overlay";

/**
 * Component that is shown when ViewsStore.load` function is awaiting some
 * promise.
 */
@inject("viewStore")
@observer
export class Loader extends Component {
  /**
   * Whether or not loading overlay is visible.
   */
  @observable private visible = false;

  /**
   * ID of a timeout that sets visibility to `false`.
   */
  private timeoutId = 0;

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
   * Sets fade out timeout if loader was visible but application is no longer
   * loading anything.
   */
  @action
  private update() {
    const { loading } = this.props.viewStore!;

    if (loading) {
      this.visible = true;
    } else if (this.visible) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(
        this.hide,
        1000 * THEME_CONSTANTS.duration
      );
    }
  }

  /**
   * Renders revolving disks inside an overlay component.
   */
  public render() {
    const { loading } = this.props.viewStore!;

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
   * Hides loader component.
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

  background-color: ${({ theme }) => theme.backgroundColor};

  animation: ${({ active }) => (active ? fadeIn : fadeOut)}
    ${({ theme }) => theme.transition} forwards;

  /* Don't let users select components below the overlay */
  user-select: ${({ active }) => (active ? "auto" : "none")};
  pointer-events: ${({ active }) => (active ? "initial" : "none")};
`;
