import styled from "styled-components";
import { UNIT } from "../styling/sizes";

/**
 * Thin container component that is intended to contain a form.
 */
export const Thin = styled.div`
  width: 100%;
  max-width: ${8 * UNIT}rem;
  margin: 0 auto;
  padding: ${UNIT / 4}rem;
  box-sizing: border-box;
`;
