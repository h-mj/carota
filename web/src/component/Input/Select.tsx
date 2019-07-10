import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { ErrorMessage } from "./ErrorMessage";
import { Field } from "./Field";
import { InputChangeHandler } from "./Input";
import { Label } from "./Label";
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
   * Error message text that will appear under the field.
   */
  errorMessage?: string;

  /**
   * Whether or not this field is invalid.
   */
  invalid?: boolean;

  /**
   * Label text that will be rendered on top of the input.
   */
  label?: string;

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
    const {
      disabled,
      errorMessage,
      invalid,
      label,
      options,
      value
    } = this.props;
    const state = getState(disabled, this.focused, invalid);

    return (
      <Field state={state}>
        {label !== undefined && <Label state={state}>{label}</Label>}
        {options !== undefined &&
          options.map(({ label: optionLabel, value: optionValue }) => (
            <Option
              disabled={disabled}
              key={optionValue}
              onClick={this.handleClick}
              onFocus={this.handleFocusChange}
              onBlur={this.handleFocusChange}
              selected={value === optionValue}
              state={getState(disabled, value === optionValue, invalid)}
              type="button"
              value={optionValue}
            >
              {optionLabel}
            </Option>
          ))}
        <ErrorMessage message={errorMessage} />
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

  /**
   * Returns select default value.
   */
  public static getDefaultValue = () => undefined;
}

/**
 * Option component props.
 */
interface OptionProps extends StateProps {
  /**
   * Wether or not this option is selected.
   */
  selected: boolean;
}

/**
 * Component that is one of the options between which selection is made.
 */
const Option = styled.button<OptionProps>`
  ${RESET};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: ${props =>
    props.selected
      ? props.theme.colorPrimary
      : props.theme.states[props.state].color};

  cursor: pointer;

  transition: ${TRANSITION};
`;
