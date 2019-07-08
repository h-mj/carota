import * as React from "react";
import styled, { keyframes } from "styled-components";
import { scaleIn, scaleOut } from "../../styling/animations";
import { LIGHT } from "../../styling/light";
import { BORDER_RADIUS, UNIT_HEIGHT } from "../../styling/sizes";

export const Loading: React.FunctionComponent = () => {
  return (
    <Squares>
      <Square />
      <Square />
      <Square />
      <Square />
    </Squares>
  );
};

/**
 * Diameter of square in `rem`s.
 */
const SQUARE_SIZE = UNIT_HEIGHT / 8;

/**
 * Offset between the start position of one square and next one.
 */
const SQUARE_OFFSET = UNIT_HEIGHT / 4;

/**
 * Component that contains moving squares.
 */
const Squares = styled.div`
  position: relative;
  width: ${2 * SQUARE_OFFSET + SQUARE_SIZE}rem;
  height: ${SQUARE_SIZE}rem;
`;

/**
 * Animation that moves a square to the right by `SQUARE_OFFSET`.
 */
const move = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(${SQUARE_OFFSET}rem); }
`;

/**
 * One of the four animated squares the loading icon contains.
 */
const Square = styled.div`
  position: absolute;

  width: ${SQUARE_SIZE}rem;
  height: ${SQUARE_SIZE}rem;

  border-radius: ${BORDER_RADIUS}rem;
  box-shadow: 0 0 0 1px, inset 0 0 0 1px;

  color: ${LIGHT.colorPrimary};

  animation-timing-function: cubic-bezier(0, 1, 1, 0);

  &:nth-child(1) {
    animation: ${scaleIn} 0.5s infinite;
  }

  &:nth-child(2) {
    left: ${2 * SQUARE_OFFSET}rem;
    animation: ${scaleOut} 0.5s infinite;
  }

  &:nth-child(3) {
    animation: ${move} 0.5s infinite;
  }

  &:nth-child(4) {
    left: ${SQUARE_OFFSET}rem;
    animation: ${move} 0.5s infinite;
  }
`;
