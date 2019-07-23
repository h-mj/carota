import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { InputWrapper } from "./collection/input";
import { RESET } from "../styling/stylesheets";
import { styled, StyleProps } from "../styling/theme";

/**
 * Text field component props.
 */
interface TextFieldProps<TName extends string> {
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
  onChange?: (name: TName, value: string) => void;

  /**
   * Function that will be called when text field focus changes.
   */
  onFocusChange?: (name: TName, focus: boolean) => void;

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
  type?: "email" | "number" | "password" | "search" | "tel" | "text";

  /**
   * Whether or not use underline style.
   */
  underline?: boolean;

  /**
   * Text field value.
   */
  value: string;
}

/**
 * Component that allows user to enter single line of text.
 */
@observer
export class TextField<TName extends string = string> extends Component<
  TextFieldProps<TName>
> {
  /**
   * Whether or not text field input is in focus.
   */
  @observable private focused = false;

  /**
   * Renders the text field optionally alongside field, label and error message
   * components.
   */
  public render() {
    const {
      basic,
      errorMessage,
      disabled,
      invalid,
      label,
      underline
    } = this.props;

    if (basic) {
      return this.renderInput();
    }

    return (
      <InputWrapper
        active={this.focused}
        asLabel={true}
        disabled={disabled}
        errorMessage={errorMessage}
        invalid={invalid}
        label={label}
        underline={underline}
      >
        {this.renderInput()}
      </InputWrapper>
    );
  }

  /**
   * Renders input component.
   */
  private renderInput() {
    const {
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
      value
    } = this.props;

    return (
      <Input
        active={this.focused}
        autoComplete={autoComplete ? "on" : "off"}
        autoFocus={autoFocus}
        disabled={disabled}
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
        value={value}
      />
    );
  }

  /**
   * Calls `onChange` callback function prop when input value is updated.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const { name, onChange } = this.props;

    if (onChange === undefined) {
      return;
    }

    onChange(name, event.currentTarget.value);
  };

  /**
   * Updates `focused` value and calls `onFocusChange` callback function on
   * focus change of the input element.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<
    HTMLInputElement
  > = event => {
    this.focused = event.type === "focus";

    const { name, onFocusChange } = this.props;

    if (onFocusChange === undefined) {
      return;
    }

    onFocusChange(name, this.focused);
  };

  /**
   * Prevents scroll wheel incrementing numeric input value by making input read
   * only for a split second.
   */
  @action
  private handleWheelScrollCapture: React.WheelEventHandler<
    HTMLInputElement
  > = async event => {
    // Cache event target since synthetic events are nulled when await statement
    // is reached.
    const target = event.currentTarget;

    target.readOnly = true;
    await new Promise(resolve => window.setTimeout(resolve, 0));
    target.readOnly = this.props.readOnly || false;
  };
}

/**
 * Input component props.
 */
interface InputProps extends StyleProps {
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

  min-width: calc(2 * ${({ theme }) => theme.PADDING});
  width: 100%;
  height: 100%;

  flex: 1 1 0;

  padding: 0 calc(${({ theme }) => theme.PADDING} / 3);
  box-sizing: border-box;

  color: ${({ theme }) => theme.PRIMARY_COLOR};
  caret-color: ${({ invalid, theme }) =>
    theme[invalid ? "INVALID_COLOR" : "ACTIVE_COLOR"]};
  text-align: ${({ textAlign }) => textAlign || "left"};

  &::placeholder {
    color: ${({ theme }) => theme.SECONDARY_COLOR};
    opacity: initial;
  }

  /* Hide numeric input spinners on webkit and firefox based browsers. */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;
