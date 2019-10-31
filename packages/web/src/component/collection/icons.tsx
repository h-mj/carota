import * as React from "react";
import { Keyframes } from "styled-components";

import { ColorTheme, keyframes, styled } from "../../styling/theme";

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
 * Icon component props.
 */
interface IconProps {
  /**
   * Dynamic icon color.
   */
  fill?: keyof ColorTheme;
}

/**
 * Icon SVG with default height.
 */
export const Icon = styled.svg<IconProps>`
  height: ${({ theme }) => theme.iconHeight};
  flex-shrink: 0;

  ${({ fill, theme }) => fill && `fill: ${theme[fill]}`}
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
  <Icon
    viewBox="0 0 42 68"
    xmlns="http://www.w3.org/2000/svg"
    fill="colorPrimary"
  >
    <path d="m32 13 10 10-5 5-10-10 5-5m-7 7 10 10-20 20-10-10 20-20m-12 32-10-10-3 13 13-3" />
  </Icon>
);

/**
 * Barcode SVG icon.
 */
export const Barcode: React.FunctionComponent = () => (
  <Icon
    viewBox="0 0 20 14"
    xmlns="http://www.w3.org/2000/svg"
    fill="colorPrimary"
  >
    <path d="m0 0h1v14h-1v-14m2 0h2v14h-2v-14m3 0h1v14h-1v-14m3 0h2v14h-2v-14m3 0h1v14h-1v-14m2 0h1v14h-1v-14m3 0h1v14h-1v-14m2 0h2v14h-2v-14" />
  </Icon>
);

/**
 * Plus SVG icon.
 */
export const Plus: React.FunctionComponent = () => (
  <Icon
    viewBox="0 0 14 10"
    xmlns="http://www.w3.org/2000/svg"
    fill="colorPrimary"
  >
    <path d="m3 4h8a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2m3-3a1 1 0 0 1 2 0v8a1 1 0 0 1-2 0v-8" />
  </Icon>
);

/**
 * Burger SVG icon.
 */
export const Burger: React.FunctionComponent = () => (
  <Icon
    viewBox="0 0 14 10"
    xmlns="http://www.w3.org/2000/svg"
    fill="colorPrimary"
  >
    <path d="m1 0h12a1 1 0 0 1 0 2h-12a1 1 0 0 1 0-2m0 4h12a1 1 0 0 1 0 2h-12a1 1 0 0 1 0-2m0 4h12a1 1 0 0 1 0 2h-12a1 1 0 0 1 0-2" />
  </Icon>
);

/**
 * Loading animation component.
 */
// prettier-ignore
export const Loading: React.FunctionComponent = () => (
  <Circles width={24} height={10}>
    <Circle keyframes={scale(0, 5, 5, "#43b02a")} />
    <Circle keyframes={move(5, 4, 5, "#43b02a", "#ff8200")} />
    <Circle keyframes={move(4, 3, 14, "#ff8200", "#ff8200")} />
    <Circle keyframes={scale(3, 0, 21, "#ff8200")} />
  </Circles>
);

/**
 * Circle size unit value.
 */
const UNIT = "0.1rem";

/**
 * Radius multiplier to increase circle quality.
 */
const RADIUS_SCALE = 100;

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
   * Animation keyframes.
   */
  keyframes: Keyframes;
}

/**
 * Circle component that either scales in or out or moves to the right.
 */
const Circle = styled.div<CircleProps>`
  position: absolute;
  top: 50%;
  left: 0;

  width: calc(2 * ${RADIUS_SCALE} * ${UNIT});
  height: calc(2 * ${RADIUS_SCALE} * ${UNIT});

  background-color: ${({ color }) => color};
  border-radius: 50%;

  animation: ${({ keyframes }) => keyframes} 0.5s infinite forwards;
`;

/**
 * Circle scale animation.
 */
export const scale = (
  radiusFrom: number,
  radiusTo: number,
  offset: number,
  color: string
) => keyframes`
  from {
    transform: translateX(calc(${offset} * ${UNIT})) translate(-50%, -50%) scale(${radiusFrom /
  RADIUS_SCALE});
    background-color: ${color};
  }

  to {
    transform: translateX(calc(${offset} * ${UNIT})) translate(-50%, -50%) scale(${radiusTo /
  RADIUS_SCALE});
    background-color: ${color};
  }
`;

/**
 * Circle move animation.
 */
export const move = (
  radiusFrom: number,
  radiusTo: number,
  offset: number,
  colorFrom: string,
  colorTo: string
) => keyframes`
  from {
    transform: translateX(calc(${offset} * ${UNIT})) translate(-50%, -50%) scale(${radiusFrom /
  RADIUS_SCALE});
    background-color: ${colorFrom};
  }

  33% {
    background-color: ${colorTo};
  }

  to {
    transform: translateX(calc(${offset +
      radiusFrom +
      radiusTo} * ${UNIT})) translate(-50%, -50%) scale(${radiusTo /
  RADIUS_SCALE});
    background-color: ${colorTo};
  }
`;
