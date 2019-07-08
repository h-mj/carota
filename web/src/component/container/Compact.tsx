import styled from "styled-components";
import { UNIT_HEIGHT } from "../../styling/sizes";

/**
 * Container component used to wrap form components.
 */
export const Compact = styled.div`
  max-width: ${8 * UNIT_HEIGHT}rem;
  width: 100%;

  margin: 0 auto;
  padding: ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;
`;
