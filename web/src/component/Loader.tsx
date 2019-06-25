import { observable, action } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import styled, { keyframes } from "styled-components";
import {
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut,
  TRANSITION_DURATION
} from "../styling/animations";
import { ACTIVE, BACKGROUND_TRANSLUCENT } from "../styling/colors";
import { UNIT } from "../styling/sizes";

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
        <DiskContainer>
          <Disk />
          <Disk />
          <Disk />
          <Disk />
        </DiskContainer>
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

/**
 * Diameter of disk in `rem`s.
 */
const DISK_SIZE = UNIT / 8;

/**
 * Offset between the start position of one disk and next one.
 */
const DISK_OFFSET = UNIT / 4;

/**
 * Component that contains moving disks.
 */
const DiskContainer = styled.div`
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
 * One of the four animated disks the loader component contains.
 */
const Disk = styled.div`
  position: absolute;

  width: ${DISK_SIZE}rem;
  height: ${DISK_SIZE}rem;

  border-radius: 50%;
  background-color: ${ACTIVE};

  animation-timing-function: cubic-bezier(0, 1, 1, 0);

  &:nth-child(1) {
    animation: ${scaleIn} 0.5s infinite;
  }

  &:nth-child(2) {
    animation: ${move} 0.5s infinite;
  }

  &:nth-child(3) {
    left: ${DISK_OFFSET}rem;
    animation: ${move} 0.5s infinite;
  }

  &:nth-child(4) {
    left: ${2 * DISK_OFFSET}rem;
    animation: ${scaleOut} 0.5s infinite;
  }
`;
