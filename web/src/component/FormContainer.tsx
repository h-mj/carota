import styled from "styled-components";
import { UNIT } from "../styling/sizes";

/**
 * Thin container component that is intended to hold form components.
 */
export const FormContainer = styled.div`
  width: 100%;
  max-width: ${7 * UNIT}rem;
  margin: 0 auto;
  padding: ${UNIT / 2}rem;
  box-sizing: border-box;
`;
