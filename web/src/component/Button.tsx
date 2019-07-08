import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Field } from "./Input/Field";
import { RESET } from "../styling/stylesheets";
import { getState, styled, StateProps } from "../styling/theme";

/**
 * Button component properties.
 */
interface ButtonProps {
  /**
   * Whether or not button is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not button is invalid.
   */
  invalid?: boolean;
}

/**
 * Button component.
 */
@observer
export class Button extends React.Component<ButtonProps> {
  /**
   * Whether or not button is focused.
   */
  @observable private focused = false;

  /**
   * Renders button component inside a field component.
   */
  public render() {
    const { children, disabled, invalid } = this.props;
    const state = getState(disabled, this.focused, invalid);

    return (
      <Field state={state}>
        <ButtonElement
          disabled={disabled}
          onBlur={this.handleFocusChange}
          onFocus={this.handleFocusChange}
          state={state}
        >
          {children}
        </ButtonElement>
      </Field>
    );
  }

  /**
   * Handles blur and focus events and sets `focused` value based on event type.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<
    HTMLButtonElement
  > = event => {
    this.focused = event.type === "focus";
  };
}

/**
 * The actual button element.
 */
const ButtonElement = styled.button<StateProps>`
  ${RESET};

  width: 100%;
  height: 100%;

  color: ${props => props.theme.states[props.state].color};

  cursor: pointer;
`;
