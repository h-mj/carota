import { UNIT_HEIGHT } from "../../styling/sizes";
import { styled } from "../../styling/theme";

/**
 * Container that fills entire screen.
 */
export const Fluid = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;
`;
