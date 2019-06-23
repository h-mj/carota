import * as React from "react";
import styled, { keyframes } from "styled-components";
import { scaleIn, scaleOut } from "../styling/animations";
import { ACTIVE, BACKGROUND_TRANSLUCENT } from "../styling/colors";
import { UNIT } from "../styling/sizes";

/**
 * Loader component props.
 */
interface LoaderProps {
  /**
   * Whether or not it should be translucent so underlying components are
   * visible.
   */
  translucent?: boolean;
}

/**
 * Component that is shown when some part of the application is being loaded.
 */
export const Loader: React.FunctionComponent<LoaderProps> = ({
  translucent
}) => (
  <Overlay translucent={translucent}>
    <DiskContainer>
      <Disk />
      <Disk />
      <Disk />
      <Disk />
    </DiskContainer>
  </Overlay>
);

/**
 * Component that fills entire container and displays its children in the middle
 * of the component.
 */
const Overlay = styled.div<LoaderProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  /* Don't let users select components below the overlay */
  user-select: none;

  ${props =>
    props.translucent && `background-color: ${BACKGROUND_TRANSLUCENT}`};
`;

/**
 * Diameter of disk in `rem`s.
 */
const DISK_SIZE = UNIT / 12;

/**
 * Offset between the start position of one disk and next one.
 */
const DISK_OFFSET = UNIT / 5;

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
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(${DISK_OFFSET}rem);
  }
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
