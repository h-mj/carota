import * as React from "react";
import styled, { keyframes } from "styled-components";
import { ACTIVE } from "../styling/colors";
import { UNIT } from "../styling/sizes";

/**
 * Component that is shown when some part of the application is being loaded.
 */
export const Loader: React.FunctionComponent = () => (
  <Overlay>
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
const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
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
 * Animation that fades a disk in.
 */
const fadeIn = keyframes`
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
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
 * Animation that fades a disk out.
 */
const fadeOut = keyframes`
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
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
    animation: ${fadeIn} 0.5s infinite;
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
    animation: ${fadeOut} 0.5s infinite;
  }
`;
