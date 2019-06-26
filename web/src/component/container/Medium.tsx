import styled from "styled-components";
import { Fluid } from "./Fluid";
import { UNIT } from "../../styling/sizes";

/**
 * Medium fixed width container component that is intended to contain errors.
 */
export const Medium = styled(Fluid)`
  max-width: ${14 * UNIT}rem;
`;
