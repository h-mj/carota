import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { getState } from "../Component";
import { Field } from "./Field";
import { InputChangeHandler } from "./Input";
import { LIGHT } from "../../styling/light";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { RESET } from "../../styling/stylesheets";

/**
 * Union of all text field types.
 */
export type TextFieldType = "email" | "number" | "password" | "tel" | "text";

/**
 * Union of all message types.
 */
export type TextFieldMessageType = "default" | "error";

/**
 * Text field component props.
 */
export interface TextFieldProps {
  /**
   * Whether or not this field should be in focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Whether or not this field is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not this field is invalid.
   */
  invalid?: boolean;

  /**
   * Name of the text field that will be included in parameters of `onChange`
   * callback function.
   */
  name?: string;

  /**
   * Function that will be called when text field value changes.
   */
  onChange?: InputChangeHandler<string>;

  /**
   * Whether or not this text field must be filled out.
   */
  required?: boolean;

  /**
   * Text field input value type.
   */
  type?: TextFieldType;

  /**
   * Text field value.
   */
  value: string;
}

/**
 * Component that allows user to enter single line of text.
 */
@observer
export class TextField extends React.Component<TextFieldProps> {
  /**
   * Whether or not input is focused.
   */
  @observable private focused = false;

  /**
   * Renders field component with text input inside it.
   */
  public render() {
    const { autoFocus, disabled, invalid, name, type, value } = this.props;

    return (
      <Field state={getState(disabled, this.focused, invalid)}>
        <Input
          autoFocus={autoFocus}
          disabled={disabled}
          name={name}
          onChange={this.handleChange}
          onBlur={this.handleFocusChange}
          onFocus={this.handleFocusChange}
          type={type}
          value={value}
        />
      </Field>
    );
  }

  /**
   * Calls `onChange` callback function with input name and value as parameters.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(this.props.name || "", event.target.value);
    }
  };

  /**
   * Handles blur and focus events and sets `focused` value based on event type.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<
    HTMLInputElement
  > = event => {
    this.focused = event.type === "focus";
  };
}

/**
 * Input component into which user enters the text.
 */
const Input = styled.input`
  ${RESET};

  width: 100%;
  height: 100%;

  padding: 0 ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;

  color: ${LIGHT.colorPrimary};
`;
