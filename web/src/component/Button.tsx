import * as React from "react";
import styled, { css } from "styled-components";
import { UNIT, BORDER_RADIUS } from "../styling/sizes";
import {
  DEFAULT_BORDER,
  DEFAULT_LABEL,
  ACTIVE,
  ERROR
} from "../styling/colors";
import { DURATION } from "../styling/animations";
import { RESET } from "../styling/stylesheets";

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
}) => <ButtonElement hasError={hasError}>{children}</ButtonElement>;

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
  ${RESET};

  width: 100%;
  height: ${UNIT}rem;

  border-radius: ${BORDER_RADIUS}rem;

  cursor: pointer;

  transition: ${DURATION}s;

  ${props => (props.hasError ? errorStyle : defaultStyle)};
`;
