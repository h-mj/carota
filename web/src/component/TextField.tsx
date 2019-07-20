import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Change callback function type that takes changed input name and new value as parameters.
 */
interface ChangeHandler<TName extends string, TValues> {
  (name: TName, value: TValues): void;
}

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
  onChange?: ChangeHandler<TName, string>;

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
   * Renders `Label`, `Input` and `ErrorMessage` components.
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
        <Label focused={this.focused} invalid={invalid}>
          {label !== undefined && (
            <Caption focused={this.focused} invalid={invalid}>
              {label}
            </Caption>
          )}
          <Input
            autoComplete={autoComplete ? "on" : "off"}
            autoFocus={autoFocus}
            disabled={disabled}
            focused={this.focused}
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
        </Label>
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
 * Props that affect styling of other components.
 */
interface TextFieldStateProps {
  /**
   * Whether or not text field input is in focus.
   */
  focused?: boolean;

  /**
   * Whether or not text field is invalid.
   */
  invalid?: boolean;
}

/**
 * Label component that contains the caption and input element.
 */
const Label = styled.label<TextFieldStateProps>`
  display: flex;

  height: ${({ theme }) => theme.HEIGHT};

  border: solid 2px
    ${({ focused, invalid, theme }) =>
      theme[
        invalid ? "INVALID_COLOR" : focused ? "ACTIVE_COLOR" : "BORDER_COLOR"
      ]};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS};
  box-sizing: border-box;

  cursor: text;

  transition: ${({ theme }) => theme.TRANSITION};
`;

/**
 * Component that displays the label text.
 */
const Caption = styled.div<TextFieldStateProps>`
  min-width: 30%;
  height: 100%;

  display: flex;
  align-items: center;

  padding: 0 calc(${({ theme }) => theme.PADDING} / 3);
  box-sizing: border-box;

  color: ${({ focused, invalid, theme }) =>
    theme[
      invalid ? "INVALID_COLOR" : focused ? "ACTIVE_COLOR" : "SECONDARY_COLOR"
    ]};

  user-select: none;

  transition: ${({ theme }) => theme.TRANSITION};
`;

/**
 * Input element into which user enters the text.
 */
const Input = styled.input<TextFieldStateProps>`
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

/**
 * Component that displays the error message under `Label` component.
 */
const ErrorMessage = styled.div`
  margin-top: calc(${({ theme }) => theme.PADDING} / 12);
  color: ${({ theme }) => theme.INVALID_COLOR};
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0;
`;
