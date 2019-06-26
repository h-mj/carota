import styled from "styled-components";
import { UNIT } from "../../styling/sizes";

/**
 * Container that fills entire width.
 */
export const Fluid = styled.div`
  width: 100%;
  margin: 0 auto;
  flex-shrink: 0;
  padding: ${UNIT}rem ${UNIT / 4}rem;
  box-sizing: border-box;
`;
