import styled from "styled-components";
import { UNIT_HEIGHT } from "../../styling/sizes";

/**
 * Container that fills entire width.
 */
export const Fluid = styled.div`
  width: 100%;
  margin: 0 auto;
  flex-shrink: 0;
  padding: ${UNIT_HEIGHT}rem ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;
`;
