import * as React from "react";
import { styled } from "../../styling/theme";

/**
 * Project logo SVG image.
 */
export const Logo: React.FunctionComponent = () => {
  return (
    <SVG viewBox="0 0 24 10">
      <circle cx="21" cy="5" r="3" fill="rgb(255, 130, 0)" />
      <circle cx="14" cy="5" r="4" fill="rgb(255, 130, 0)" />
      <circle cx="5" cy="5" r="5" fill="rgb(67, 176, 42)" />
    </SVG>
  );
};

/**
 * SVG element with defined default width.
 */
const SVG = styled.svg`
  width: 2rem;
`;
