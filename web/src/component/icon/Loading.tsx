import * as React from "react";
import { scaleIn, scaleOut } from "../../styling/animations";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { keyframes, styled } from "../../styling/theme";

export const Loading: React.FunctionComponent = () => {
  return (
    <Disks>
      <Disk />
      <Disk />
      <Disk />
      <Disk />
    </Disks>
  );
};

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

  background-color: ${({ theme }) => theme.states.active.borderColor};

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
