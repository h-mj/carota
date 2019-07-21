import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { ErrorMessage, Field, Label } from "./collection/input";
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
   * Text field input value type.
   */
  type?: "email" | "number" | "password" | "search" | "tel" | "text";

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
   * Renders the text field.
   */
  public render() {
    const {
      autoComplete,
      autoFocus,
      disabled,
      errorMessage,
      invalid,
      label,
      name,
      placeholder,
      readOnly,
      required,
      type,
      value
    } = this.props;

    return (
      <div>
        <Field as="label" active={this.focused} invalid={invalid}>
          {label !== undefined && (
            <Label active={this.focused} invalid={invalid}>
              {label}
            </Label>
          )}
          <Input
            autoComplete={autoComplete ? "on" : "off"}
            autoFocus={autoFocus}
            disabled={disabled}
            active={this.focused}
            invalid={invalid}
            name={name}
            onBlur={this.handleFocusChange}
            onChange={this.handleChange}
            onFocus={this.handleFocusChange}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            type={type}
            value={value}
          />
        </Field>
        {errorMessage !== undefined && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}
      </div>
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

    onChange(name, event.target.value);
  };

  /**
   * Updates `focused` value on focus change of the input element.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<
    HTMLInputElement
  > = event => {
    this.focused = event.type === "focus";
  };
}

/**
 * Input element into which user enters the text.
 */
const Input = styled.input<StyleProps>`
  ${RESET};

  width: 100%;
  height: 100%;

  padding: 0 calc(${({ theme }) => theme.PADDING} / 3);
  box-sizing: border-box;

  color: ${({ theme }) => theme.PRIMARY_COLOR};
  caret-color: ${({ invalid, theme }) =>
    theme[invalid ? "INVALID_COLOR" : "ACTIVE_COLOR"]};

  &::placeholder {
    color: ${({ theme }) => theme.SECONDARY_COLOR};
    opacity: initial;
  }
`;
