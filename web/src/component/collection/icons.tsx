import * as React from "react";
import { Keyframes } from "styled-components";
import { scaleIn, scaleOut } from "../../styling/animations";
import { keyframes, styled } from "../../styling/theme";

/**
 * Orange color.
 */
const ORANGE = "#ff8200";

/**
 * Green color.
 */
const GREEN = "#43b02a";

/**
 * Project logo SVG image.
 */
export const Logo: React.FunctionComponent = () => (
  <svg viewBox="0 0 24 10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="5" fill={GREEN} />
    <circle cx="14" cy="5" r="4" fill={ORANGE} />
    <circle cx="21" cy="5" r="3" fill={ORANGE} />
  </svg>
);

/**
 * Energy SVG icon.
 */
export const Energy: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path d="m29 0l-10 30h23l-29 38 10-28h-23" fill={GREEN} />
  </svg>
);

/**
 * Protein SVG icon.
 */
export const Protein: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m0 8l42-4v8l-42 4m0 8l42-4v8l-42 4m0 8l42-4v8l-42 4m0 8l42-4v8l-42 4"
      fill="#6b9cde"
    />
    <path
      d="m0 8l42 12v8l-42-12m0 8l42 12v8l-42-12m0 8l42 12v8l-42-12"
      fill="#9bc7ff"
    />
  </svg>
);

/**
 * Fat SVG icon.
 */
export const Fat: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path d="m21 3l-18 30a21 21 0 1 0 36 0l-18-30" fill={ORANGE} />
  </svg>
);

/**
 * Carbohydrate SVG icon.
 */
export const Carbohydrate: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m21 28a20 20 0 0 0 0 -28 20 20 0 0 0 0 28m-21-12a20 20 0 0 0 20 20 20 20 0 0 0 -20 -20m0 16a20 20 0 0 0 20 20 20 20 0 0 0 -20 -20m0 16a20 20 0 0 0 20 20 20 20 0 0 0 -20 -20m42-32a20 20 0 0 0 -20 20 20 20 0 0 0 20 -20m0 16a20 20 0 0 0 -20 20 20 20 0 0 0 20 -20m0 16a20 20 0 0 0 -20 20 20 20 0 0 0 20 -20"
      fill="#fabc1f"
    />
  </svg>
);

/**
 * Loading animation component.
 */
export const Loading: React.FunctionComponent = () => (
  <Circles width={24} height={10}>
    <Circle offset={0} radius={5} color={GREEN} keyframes={scaleIn} />
    <Circle offset={0} radius={5} color={GREEN} keyframes={MOVE_5} />
    <Circle offset={10} radius={4} color={ORANGE} keyframes={MOVE_4} />
    <Circle offset={18} radius={3} color={ORANGE} keyframes={scaleOut} />
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
  width: calc(${props => props.width} * ${UNIT});
  height: calc(${props => props.height} * ${UNIT});
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
 * Returns keyframes that change circle radius from `radius` to `radius - 1` and background color from `from` to `to`.
 *
 * @param radius Initial circle radius.
 * @param from Initial circle background color.
 * @param to Final circle background color.
 */
const move = (radius: number, from: string, to: string) => keyframes`
  from {
    transform: translateX(0);
    top: calc((5 - ${radius}) * ${UNIT});
    width: calc(${2 * radius} * ${UNIT});
    height: calc(${2 * radius} * ${UNIT});
    background-color: ${from};
  }

  33% {
    background-color: ${to};
  }

  to {
    transform: translateX(calc(${2 * radius} * ${UNIT}));
    top: calc((5 - ${radius - 1}) * ${UNIT});
    width: calc(${2 * radius - 2} * ${UNIT});
    height: calc(${2 * radius - 2} * ${UNIT});
    background-color: ${to};
  }
`;

/**
 * Move animation keyframes of circle with radius 5.
 */
const MOVE_5 = move(5, GREEN, ORANGE);

/**
 * Move animation keyframes of circle with radius 4.
 */
const MOVE_4 = move(4, ORANGE, ORANGE);

/**
 * Circle component that either scales in or out or moves to the right.
 */
const Circle = styled.div<CircleProps>`
  position: absolute;
  top: calc((5 - ${({ radius }) => radius}) * ${UNIT});
  left: calc(${props => props.offset} * ${UNIT});

  width: calc(${({ radius }) => 2 * radius} * ${UNIT});
  height: calc(${({ radius }) => 2 * radius} * ${UNIT});

  background-color: ${({ color }) => color};
  border-radius: calc(${props => props.radius} * ${UNIT});

  animation: ${({ keyframes }) => keyframes} 0.5s infinite forwards;
`;
