import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Field } from "./Field";
import { InputChangeHandler } from "./Input";
import { TRANSITION } from "../../styling/animations";
import { RESET } from "../../styling/stylesheets";
import { getState, StateProps, styled } from "../../styling/theme";

/**
 * Type of an object that contains required information about an option.
 */
export interface SelectOption<TValues extends string = string> {
  /**
   * Visible text representation of the value.
   */
  label: string;

  /**
   * Internal value of the option.
   */
  value: TValues;
}

/**
 * Select field component props.
 */
export interface SelectProps<TValues extends string = string> {
  /**
   * Whether or not this field is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not this field is invalid.
   */
  invalid?: boolean;

  /**
   * Name of the select component that will be included in parameters of
   * `onChange` callback function.
   */
  name?: string;

  /**
   * Function that will be called when selected option changes.
   */
  onChange?: InputChangeHandler<TValues>;

  /**
   * Array of options between which selection is made.
   */
  options?: Array<SelectOption<TValues>>;

  /**
   * Whether or not this text field must be filled out.
   */
  required?: boolean;

  /**
   * Selected option value.
   */
  value: TValues | undefined;
}

/**
 * Component that allows user to select between finite array of options.
 */
@observer
export class Select<TValues extends string = string> extends React.Component<
  SelectProps<TValues>
> {
  /**
   * Whether or not input is focused.
   */
  @observable private focused = false;

  /**
   * Renders field component with option components inside it.
   */
  public render() {
    const { disabled, invalid, options, value } = this.props;

    return (
      <Field state={getState(disabled, this.focused, invalid)}>
        {options !== undefined &&
          options.map(({ label: optionLabel, value: optionValue }) => (
            <Option
              key={optionValue}
              onClick={this.handleClick}
              onFocus={this.handleFocusChange}
              onBlur={this.handleFocusChange}
              state={getState(disabled, value === optionValue, invalid)}
              type="button"
              value={optionValue}
            >
              {optionLabel}
            </Option>
          ))}
      </Field>
    );
  }

  /**
   * Handles option click event and calls `onChange` event with clicked option
   * value.
   */
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(this.props.name || "", (event.target as any).value);
    }
  };

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
 * Component that is one of the options between which selection is made.
 */
const Option = styled.button<StateProps>`
  ${RESET};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: ${props => props.theme.states[props.state].color};

  cursor: pointer;

  transition: ${TRANSITION};
`;
