import { Fluid } from "./Fluid";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { styled } from "../../styling/theme";

/**
 * Container component used to wrap form components.
 */
export const Compact = styled(Fluid)`
  max-width: ${8 * UNIT_HEIGHT}rem;
`;
