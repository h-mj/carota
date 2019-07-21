import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { Overlay } from "./container/Overlay";
import {
  DURATION,
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut
} from "../styling/animations";
import { UNIT_HEIGHT } from "../styling/sizes";
import { keyframes, styled } from "../styling/theme";

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
   * Creates a new instance of `Loader` and updates loading state.
   */
  public constructor(props: any) {
    super(props);
    this.update();
  }

  /**
   * Updates loading component on component update.
   */
  @action
  public componentWillUpdate() {
    this.update();
  }

  /**
   * Sets fade out timeout if needed and updates `previousIsLoading` value.
   */
  @action
  private update() {
    const { loading } = this.props.views!;

    // If we were loading but not anymore, fade out.
    if (this.previousIsLoading && !loading) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(this.hide, 1000 * DURATION);
    }

    this.previousIsLoading = loading;
  }

  /**
   * Renders revolving disks inside an overlay component.
   */
  public render() {
    const { loading } = this.props.views!;

    if (loading || this.timeoutId !== 0) {
      return (
        <LoaderOverlay isActive={loading}>
          <Disks>
            <Disk />
            <Disk />
            <Disk />
            <Disk />
          </Disks>
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
 * though it if fading its out.
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

/**
 * Diameter of a disk in `rem`s.
 */
const DISK_SIZE = UNIT_HEIGHT / 6;

/**
 * Offset between the start position of one disk and next one.
 */
const DISK_OFFSET = UNIT_HEIGHT / 3;

/**
 * Component that contains moving disks.
 */
const Disks = styled.div`
  position: relative;
  width: ${2 * DISK_OFFSET + DISK_SIZE}rem;
  height: ${DISK_SIZE}rem;
`;

/**
 * Animation that moves a disk to the right by `DISK_OFFSET`.
 */
const move = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(${DISK_OFFSET}rem); }
`;

/**
 * One of the four animated disks the loading icon contains.
 */
const Disk = styled.div`
  position: absolute;

  width: ${DISK_SIZE}rem;
  height: ${DISK_SIZE}rem;

  border-radius: ${DISK_SIZE / 2}rem;

  background-color: ${({ theme }) => theme.ACTIVE_COLOR};

  animation-timing-function: cubic-bezier(0, 1, 1, 0);

  &:nth-child(1) {
    animation: ${scaleIn} 0.5s infinite;
  }

  &:nth-child(2) {
    left: ${2 * DISK_OFFSET}rem;
    animation: ${scaleOut} 0.5s infinite;
  }

  &:nth-child(3) {
    animation: ${move} 0.5s infinite;
  }

  &:nth-child(4) {
    left: ${DISK_OFFSET}rem;
    animation: ${move} 0.5s infinite;
  }
`;
