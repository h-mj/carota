import * as React from "react";
import styled, { css } from "styled-components";
import { UNIT, BORDER_RADIUS } from "../styling/sizes";
import {
  DEFAULT_BORDER,
  DEFAULT_LABEL,
  ACTIVE,
  ERROR
} from "../styling/colors";
import { TRANSITION_DURATION } from "../styling/animations";

/**
 * Button component properties.
 */
interface ButtonProps {
  hasError?: boolean;
}

/**
 * Button component.
 */
export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  hasError
}) => (
  <Container>
    <ButtonElement hasError={hasError}>{children}</ButtonElement>
  </Container>
);

/**
 * Container component that contains the button component.
 */
const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${UNIT}rem;
`;

/**
 * Button color styling when property `hasError` is not `true`.
 */
const defaultStyle = css`
  box-shadow: 0 0 0 1px ${DEFAULT_BORDER}, inset 0 0 0 1px ${DEFAULT_BORDER};
  color: ${DEFAULT_LABEL};

  &:active,
  &:focus {
    box-shadow: 0 0 0 1px ${ACTIVE}, inset 0 0 0 1px ${ACTIVE};
    color: ${ACTIVE};
  }
`;

/**
 * Button color styling when property `hasError` is `true`.
 */
const errorStyle = css`
  box-shadow: 0 0 0 1px ${ERROR}, inset 0 0 0 1px ${ERROR};
  color: ${ERROR};
`;

/**
 * The actual button element.
 */
const ButtonElement = styled.button<ButtonProps>`
  /* Reset */
  border: none;
  outline: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;

  position: absolute;
  top: ${UNIT / 8}rem;

  width: 100%;
  height: ${(3 * UNIT) / 4}rem;

  border-radius: ${BORDER_RADIUS}rem;

  cursor: pointer;

  transition: ${TRANSITION_DURATION}s;

  ${props => (props.hasError ? errorStyle : defaultStyle)};
`;
