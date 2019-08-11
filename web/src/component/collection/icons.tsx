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
  <svg viewBox="0 0 24 10">
    <circle cx="21" cy="5" r="3" fill="rgb(255, 130, 0)" />
    <circle cx="14" cy="5" r="4" fill="rgb(255, 130, 0)" />
    <circle cx="5" cy="5" r="5" fill="rgb(67, 176, 42)" />
  </svg>
);

/**
 * Energy SVG icon.
 */
export const Energy: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 29,0
      L 19,30
      L 42,30
      L 13,68
      L 23,40
      L 0,40
      "
      fill="rgb(67, 176, 42)"
    />
  </svg>
);

/**
 * Protein SVG icon.
 */
export const Protein: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 0,8
      L 42,4
      L 42,12
      L 0,16

      M 0,24
      L 42,20
      L 42,28
      L 0,32

      M 0,40
      L 42,36
      L 42,44
      L 0,48

      M 0,56
      L 42,52
      L 42,60
      L 0,64
      "
      fill="rgb(107, 156, 222)"
    />

    <path
      d="
      M 0,8
      L 42,20
      L 42,28
      L 0,16

      M 0,24
      L 42,36
      L 42,44
      L 0,32

      M 0,40
      L 42,52
      L 42,60
      L 0,48
      "
      fill="rgb(155,199,255)"
    />
  </svg>
);

/**
 * Fat SVG icon.
 */
export const Fat: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 21,3
      L 3,33
      A 21,21 0,1,0 39,33
      L 21,3
      "
      fill="rgb(255, 130, 0)"
    />
  </svg>
);

/**
 * Carbohydrate SVG icon.
 */
export const Carbohydrate: React.FunctionComponent = () => (
  <svg viewBox="0 0 42 68">
    <path
      d="
      M 21,28
      A 20,20 0,0,0 21,0
      A 20,20 0,0,0 21,28

      M 0,16
      A 20,20 0,0,0 20,36
      A 20,20 0,0,0 0,16

      M 0,32
      A 20,20 0,0,0 20,52
      A 20,20 0,0,0 0,32

      M 0,48
      A 20,20 0,0,0 20,68
      A 20,20 0,0,0 0,48

      M 42,16
      A 20,20 0,0,0 22,36
      A 20,20 0,0,0 42,16

      M 42,32
      A 20,20 0,0,0 22,52
      A 20,20 0,0,0 42,32

      M 42,48
      A 20,20 0,0,0 22,68
      A 20,20 0,0,0 42,48"
      fill="rgb(250, 188, 31)"
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
