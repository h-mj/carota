import * as React from "react";
import { Keyframes } from "styled-components";

import { scaleIn, scaleOut } from "../../styling/animations";
import { keyframes, styled } from "../../styling/theme";

/**
 * Project logo SVG image.
 */
export const Logo: React.FunctionComponent = () => (
  <svg viewBox="0 0 24 10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="5" fill="#43b02a" />
    <circle cx="14" cy="5" r="4" fill="#ff8200" />
    <circle cx="21" cy="5" r="3" fill="#ff8200" />
  </svg>
);

/**
 * Icon SVG with default height.
 */
export const Icon = styled.svg`
  height: ${({ theme }) => theme.iconHeight};
  flex-shrink: 0;
`;

/**
 * Energy SVG icon.
 */
export const Energy: React.FunctionComponent = () => (
  <Icon viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path d="m29 0l-10 30h23l-29 38 10-28h-23" fill="#43b02a" />
  </Icon>
);

/**
 * Protein SVG icon.
 */
export const Protein: React.FunctionComponent = () => (
  <Icon viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m0 8l42-4v8l-42 4m0 8l42-4v8l-42 4m0 8l42-4v8l-42 4m0 8l42-4v8l-42 4"
      fill="#6b9cde"
    />
    <path
      d="m0 8l42 12v8l-42-12m0 8l42 12v8l-42-12m0 8l42 12v8l-42-12"
      fill="#9bc7ff"
    />
  </Icon>
);

/**
 * Fat SVG icon.
 */
export const Fat: React.FunctionComponent = () => (
  <Icon viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path d="m21 3l-18 30a21 21 0 1 0 36 0l-18-30" fill="#ff8200" />
  </Icon>
);

/**
 * Carbohydrate SVG icon.
 */
export const Carbohydrate: React.FunctionComponent = () => (
  <Icon viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m21 28a20 20 0 0 0 0 -28 20 20 0 0 0 0 28m-21-12a20 20 0 0 0 20 20 20 20 0 0 0 -20 -20m0 16a20 20 0 0 0 20 20 20 20 0 0 0 -20 -20m0 16a20 20 0 0 0 20 20 20 20 0 0 0 -20 -20m42-32a20 20 0 0 0 -20 20 20 20 0 0 0 20 -20m0 16a20 20 0 0 0 -20 20 20 20 0 0 0 20 -20m0 16a20 20 0 0 0 -20 20 20 20 0 0 0 20 -20"
      fill="#fabc1f"
    />
  </Icon>
);

/**
 * Pencil SVG icon.
 */
export const Pencil: React.FunctionComponent = () => (
  <Icon viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path d="m32 13 10 10-5 5-10-10 5-5m-7 7 10 10-20 20-10-10 20-20m-12 32-10-10-3 13 13-3" fill="#666666" />
  </Icon>
);

/**
 * Loading animation component.
 */
// prettier-ignore
export const Loading: React.FunctionComponent = () => (
  <Circles width={24} height={10}>
    <Circle offset={0} radius={5} color="#43b02a" keyframes={scaleIn} />
    <Circle offset={0} radius={5} color="#43b02a" keyframes={move(5, "#ff8200")} />
    <Circle offset={10} radius={4} color="#ff8200" keyframes={move(4, "#ff8200")} />
    <Circle offset={18} radius={3} color="#ff8200" keyframes={scaleOut} />
  </Circles>
);

/**
 * Circle size unit value.
 */
const UNIT = "0.1rem";

/**
 * Circles component props.
 */
interface CirclesProps {
  /**
   * Container width in units.
   */
  width: number;

  /**
   * Container width in units.
   */
  height: number;
}

/**
 * Component that contains `Circle` components.
 */
const Circles = styled.div<CirclesProps>`
  position: relative;
  width: calc(${({ width }) => width} * ${UNIT});
  height: calc(${({ height }) => height} * ${UNIT});
`;

/**
 * Circle component props.
 */
interface CircleProps {
  /**
   * Circle color.
   */
  color: string;

  /**
   * Animation keyframes.
   */
  keyframes: Keyframes;

  /**
   * Offset in x-axis in units.
   */
  offset: number;

  /**
   * Circle radius.
   */
  radius: number;
}

/**
 * Returns keyframes that change circle radius to `radius - 1` and background to `to`.
 *
 * @param radius Initial circle radius.
 * @param to Final circle background color.
 */
const move = (radius: number, to: string) => keyframes`
  33% {
    background-color: ${to};
  }

  to {
    transform: translate(calc(${2 * radius} * ${UNIT}), ${UNIT});
    width: calc(${2 * (radius - 1)} * ${UNIT});
    height: calc(${2 * (radius - 1)} * ${UNIT});
    background-color: ${to};
  }
`;

/**
 * Circle component that either scales in or out or moves to the right.
 */
const Circle = styled.div<CircleProps>`
  position: absolute;
  top: calc(${({ radius }) => 5 - radius} * ${UNIT});
  left: calc(${({ offset }) => offset} * ${UNIT});

  width: calc(${({ radius }) => 2 * radius} * ${UNIT});
  height: calc(${({ radius }) => 2 * radius} * ${UNIT});

  background-color: ${({ color }) => color};
  border-radius: 50%;

  animation: ${({ keyframes }) => keyframes} 0.5s infinite forwards;
`;
