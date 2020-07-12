import { action, computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { CheckBox } from "./CheckBox";
import { InputStyleProps, InputWrapper } from "./InputWrapper";

/**
 * Text field component props.
 */
interface TextFieldProps<TName extends string, TOptional extends boolean> {
  /**
   * Custom element that will be rendered after the text field and after
   * optional unit component.
   */
  append?: JSX.Element;

  /**
   * Whether or not text field should have autocomplete enabled.
   */
  autoComplete?: boolean;

  /**
   * Whether or not text field should be in focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Whether or not render only input element.
   */
  basic?: boolean;

  /**
   * Whether or not text field is disabled.
   */
  disabled?: boolean;

  /**
   * Error message text that will be rendered under the text field.
   */
  errorMessage?: string;

  /**
   * Helper message that will be rendered above the the text field.
   */
  helperMessage?: string;

  /**
   * Whether or not text field is invalid.
   */
  invalid?: boolean;

  /**
   * Label text that will be rendered next to the text field.
   */
  label?: string;

  /**
   * Name of the text field that will be included in parameters of `onChange`
   * callback function.
   */
  name: TName;

  /**
   * Function that will be called when text field value changes.
   */
  onChange?: TOptional extends true
    ? (name: TName, value: string | undefined) => void
    : (name: TName, value: string) => void;

  /**
   * Function that will be called when text field focus changes.
   */
  onFocusChange?: (name: TName, focus: boolean) => void;

  /**
   * Whether or not text field is optional.
   */
  optional?: TOptional;

  /**
   * Text that will be shown inside the text field if it's empty.
   */
  placeholder?: string;

  /**
   * Whether or not text field is read only.
   */
  readOnly?: boolean;

  /**
   * Whether or not text field is required and should be filled.
   */
  required?: boolean;

  /**
   * Text field input text align.
   */
  textAlign?: "left" | "center" | "right";

  /**
   * Text field input value type.
   */
  type?: "date" | "email" | "number" | "password" | "search" | "tel" | "text";

  /**
   * Text field input value unit that will be rendered after the input.
   */
  unit?: string;

  /**
   * Text field value.
   */
  value: TOptional extends true ? string | undefined : string;
}

/**
 * Component that allows user to enter single line of text.
 */
@observer
export class TextField<
  TName extends string = string,
  TOptional extends boolean = false
> extends Component<TextFieldProps<TName, TOptional>> {
  /**
   * Whether or not text field input is in focus.
   */
  @observable private _focused = false;

  /**
   * Renders the text field optionally alongside field, label and error message
   * components.
   */
  public render() {
    const {
      basic,
      errorMessage,
      helperMessage,
      disabled,
      invalid,
      label,
      value,
    } = this.props;

    if (basic) {
      return this.renderInput();
    }

    return (
      <InputWrapper
        active={this.focused}
        disabled={disabled || value === undefined}
        errorMessage={errorMessage}
        helperMessage={helperMessage}
        input={this.renderInput()}
        invalid={invalid}
        label={label}
        prepend={this.renderCheckBox()}
        withLabel={true}
      />
    );
  }

  /**
   * Renders input component.
   */
  private renderInput() {
    const {
      append,
      autoComplete,
      autoFocus,
      disabled,
      invalid,
      name,
      placeholder,
      readOnly,
      required,
      textAlign,
      type,
      unit,
      value,
    } = this.props;

    return (
      <>
        <Input
          active={this.focused}
          autoComplete={autoComplete ? "on" : "off"}
          autoFocus={autoFocus}
          disabled={disabled || value === undefined}
          invalid={invalid}
          name={name}
          onBlur={this.handleFocusChange}
          onChange={this.handleChange}
          onFocus={this.handleFocusChange}
          onWheelCapture={this.handleWheelScrollCapture}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          textAlign={textAlign}
          type={type}
          value={value || ""}
        />
        {unit !== undefined && (
          <Unit active={this.focused} disabled={disabled} invalid={invalid}>
            {unit}
          </Unit>
        )}
        {append}
      </>
    );
  }

  /**
   * Renders optional text field check box that will be rendered before the
   * input label and is used to enable or disable given text field. If text
   * field is not optional, returns `null`.
   */
  private renderCheckBox() {
    const { disabled, invalid, name, optional, value } = this.props;

    if (!optional) {
      return null;
    }

    return (
      <CheckBox
        basic={true}
        disabled={disabled}
        invalid={invalid}
        name={name}
        onChange={this.handleCheck}
        onFocusChange={this.handleCheckBoxFocusChange}
        value={value !== undefined}
      />
    );
  }

  /**
   * Returns whether or not text field is in focus.
   */
  @computed
  private get focused() {
    return this._focused;
  }

  /**
   * Sets text field focus value and calls `onFocusChange` callback function prop.
   */
  private set focused(focused: boolean) {
    this._focused = focused;

    const { name, onFocusChange } = this.props;

    if (onFocusChange === undefined) {
      return;
    }

    onFocusChange(name, this.focused);
  }

  /**
   * Calls `onChange` callback function prop when input value is updated.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { name, onChange } = this.props;

    if (onChange === undefined) {
      return;
    }

    onChange(name, event.currentTarget.value);
  };

  /**
   * Calls `onChange` callback function prop when user enables or disables the text field.
   */
  @action
  private handleCheck = (name: TName, check: boolean) => {
    // Assume text field is optional since only then this method is called.
    const { onChange } = this.props as TextFieldProps<TName, true>;

    if (onChange === undefined) {
      return;
    }

    onChange(name, check ? "" : undefined);
  };

  /**
   * Updates `focused` value and calls `onFocusChange` callback function on
   * focus change of the input element.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    this.focused = event.type === "focus";
  };

  /**
   * Updates text field focus state on check box focus change.
   */
  @action
  private handleCheckBoxFocusChange = (_: TName, focused: boolean) => {
    this.focused = focused;
  };

  /**
   * Prevents scroll wheel incrementing numeric input value by making input read
   * only for a split second.
   */
  @action
  private handleWheelScrollCapture: React.WheelEventHandler<
    HTMLInputElement
  > = async (event) => {
    // Cache event target since synthetic events are nulled when await statement
    // is reached.
    const target = event.currentTarget;

    target.readOnly = true;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    target.readOnly = this.props.readOnly || false;
  };
}

/**
 * Input component props.
 */
interface InputProps extends InputStyleProps {
  /**
   * Text field input text align.
   */
  textAlign?: "left" | "center" | "right";
}

/**
 * Input element into which user enters the text.
 */
const Input = styled.input<InputProps>`
  ${RESET};

  min-width: calc(2 * ${({ theme }) => theme.padding});
  width: 100%;
  height: 100%;

  flex: 1 1 0;

  color: ${({ theme }) => theme.colorPrimary};
  caret-color: ${({ invalid, theme }) =>
    invalid ? theme.colorInvalid : theme.colorActive};
  text-align: ${({ textAlign }) => textAlign || "left"};

  &::placeholder {
    color: ${({ theme }) => theme.colorSecondary};
    opacity: initial;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button,
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }

  &[type="date"]:invalid {
    color: ${({ theme }) => theme.colorSecondary};
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

/**
 * Component that displays the unit.
 */
const Unit = styled.span<InputStyleProps>`
  width: ${({ theme }) => theme.padding};

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ active, invalid, theme }) =>
    invalid
      ? theme.colorInvalid
      : active
      ? theme.colorActive
      : theme.colorSecondary};
  white-space: nowrap;

  user-select: none;

  transition: ${({ theme }) => theme.transition};
`;
