import * as React from "react";
import { RESET } from "../styling/stylesheets";
import { Component } from "./Component";
import { styled } from "../styling/theme";

/**
 * Button component props.
 */
interface ButtonProps {
  /**
   * Whether or not button should be automatically in focus.
   */
  autoFocus?: boolean;

  /**
   * Whether or not button is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not button is invalid.
   */
  invalid?: boolean;

  /**
   * Button type, that changes the effect on parent <form> element when button
   * is clicked.
   *
   * Behavior of each type button click inside a <form> element:
   * - `button` - Doesn't affect the form;
   * - `reset` - Resets all form fields;
   * - `submit` - Submits the form data.
   */
  type?: "button" | "reset" | "submit";
}

/**
 * Button component.
 */
export class Button extends Component<ButtonProps> {
  /**
   * Renders the button.
   */
  public render() {
    const { autoFocus, children, disabled, invalid, type } = this.props;

    return (
      <ButtonElement
        autoFocus={autoFocus}
        disabled={disabled}
        invalid={invalid}
        type={type}
      >
        {children}
      </ButtonElement>
    );
  }
}

/**
 * Button props that affect styling.
 */
interface ButtonElementProps {
  /**
   * Whether or not button is invalid.
   */
  invalid?: boolean;
}

/**
 * Actual button element component.
 */
const ButtonElement = styled.button<ButtonElementProps>`
  ${RESET};

  height: ${({ theme }) => theme.PADDING};
  padding: 0 ${({ theme }) => theme.PADDING};

  border-radius: ${({ theme }) => theme.BORDER_RADIUS};
  background-color: ${({ invalid, theme }) =>
    theme[invalid ? "INVALID_COLOR" : "ACTIVE_COLOR"]};

  color: ${({ theme }) => theme.BACKGROUND_COLOR};

  cursor: pointer;

  transition: ${({ theme }) => theme.TRANSITION};
`;
