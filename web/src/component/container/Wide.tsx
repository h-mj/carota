import styled from "styled-components";
import { Fluid } from "./Fluid";
import { UNIT } from "../../styling/sizes";

/**
 * Wide fixed width container component that is intended to contain scene content.
 */
export const Wide = styled(Fluid)`
  max-width: ${20 * UNIT}rem;
`;
