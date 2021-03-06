import * as React from "react";

import { Component } from "../base/Component";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Button component props.
 */
interface ButtonProps {
  /**
   * Whether button should be automatically in focus.
   */
  autoFocus?: boolean;

  /**
   * Whether button is disabled.
   */
  disabled?: boolean;

  /**
   * Whether button is invalid.
   */
  invalid?: boolean;

  /**
   * Button click event handler function.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * Whether button is secondary.
   */
  secondary?: boolean;

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
    const {
      autoFocus,
      children,
      disabled,
      invalid,
      onClick,
      secondary,
      type,
    } = this.props;

    return (
      <ButtonElement
        autoFocus={autoFocus}
        disabled={disabled}
        invalid={invalid}
        onClick={onClick}
        secondary={secondary}
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
   * Whether button is invalid.
   */
  invalid?: boolean;

  /**
   * Whether button is secondary.
   */
  secondary?: boolean;
}

/**
 * Actual button element component.
 */
const ButtonElement = styled.button<ButtonElementProps>`
  ${RESET};

  height: ${({ theme }) => theme.heightSecondary};
  padding: 0 ${({ theme }) => theme.padding};

  flex-shrink: 0;

  border-radius: ${({ theme }) => theme.borderRadius};
  ${({ invalid, secondary, theme }) =>
    secondary &&
    `border: solid 1px ${invalid ? theme.colorInvalid : theme.borderColor}`};
  ${({ invalid, secondary, theme }) =>
    secondary &&
    invalid &&
    `box-shadow: inset 0 0 0 1px ${theme.colorInvalid}`};
  ${({ invalid, secondary, theme }) =>
    !secondary &&
    `background-color: ${invalid ? theme.colorInvalid : theme.colorActive}`};

  color: ${({ invalid, secondary, theme }) =>
    secondary && invalid ? theme.colorInvalid : theme.colorPrimary};
  text-align: center;

  cursor: pointer;

  transition: ${({ theme }) => theme.transition};
`;
