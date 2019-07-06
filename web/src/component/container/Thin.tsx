import styled from "styled-components";
import { Fluid } from "./Fluid";
import { UNIT_HEIGHT } from "../../styling/sizes";

/**
 * Fixed width container component that is intended to contain a form.
 */
export const Thin = styled(Fluid)`
  max-width: ${8 * UNIT_HEIGHT}rem;
`;
