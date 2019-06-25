import styled from "styled-components";
import { UNIT } from "../styling/sizes";

/**
 * Wide container component that is intended to contain scene content.
 */
export const Wide = styled.div`
  width: 100%;
  max-width: ${16 * UNIT}rem;
  margin: 0 auto;
  padding: ${UNIT / 4}rem;
  box-sizing: border-box;
`;
