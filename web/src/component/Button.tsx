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
export class Button extends Component<"Button", ButtonProps> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: ButtonProps) {
    super("Button", props);
  }

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

  height: ${({ theme }) => theme.padding};
  padding: 0 ${({ theme }) => theme.padding};

  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ invalid, theme }) =>
    invalid ? theme.red : theme.orange};

  color: ${({ invalid, theme }) =>
    invalid ? theme.backgroundColor : theme.primaryColor};

  cursor: pointer;

  transition: ${({ theme }) => theme.transition};
`;
