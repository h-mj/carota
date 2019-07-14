import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { ErrorMessage } from "./ErrorMessage";
import { Field } from "./Field";
import { InputChangeHandler } from "./Input";
import { Label } from "./Label";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { RESET } from "../../styling/stylesheets";
import { css, getState, styled } from "../../styling/theme";
import { resolveAfterTimeout } from "../../utility/promises";

/**
 * Union of all text field types.
 */
export type TextFieldType = "email" | "number" | "password" | "tel" | "text";

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
   * Name of the text field that will be included in parameters of `onChange`
   * callback function.
   */
  name: string;

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
   * Input element reference for preventing mouse wheel numeric value increment
   * and decrementing.
   */
  private reference: React.RefObject<HTMLInputElement>;

  /**
   * Creates actual input element reference.
   */
  public constructor(props: TextFieldProps) {
    super(props);

    this.reference = React.createRef<HTMLInputElement>();
  }

  /**
   * Renders field component with text input inside it.
   */
  public render() {
    const {
      autoFocus,
      disabled,
      errorMessage,
      invalid,
      label,
      name,
      type,
      value
    } = this.props;

    const state = getState(disabled, this.focused, invalid);

    return (
      <Field state={state}>
        {label !== undefined && (
          <TextFieldLabel
            placeholderStyle={value === "" && !this.focused}
            state={state}
          >
            {label}
          </TextFieldLabel>
        )}
        <Input
          autoFocus={autoFocus}
          disabled={disabled}
          name={name}
          onBlur={this.handleFocusChange}
          onChange={this.handleChange}
          onFocus={this.handleFocusChange}
          onWheelCapture={this.handleWheelCapture}
          ref={this.reference}
          type={type}
          value={value}
        />
        <ErrorMessage message={errorMessage} />
      </Field>
    );
  }

  /**
   * Calls `onChange` callback function with input name and value as parameters.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(this.props.name, event.target.value);
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

  /**
   * Prevents wheel scroll altering input value.
   */
  private handleWheelCapture: React.WheelEventHandler<
    HTMLInputElement
  > = async () => {
    // Make input readonly for a split second.
    this.reference.current!.readOnly = true;
    await resolveAfterTimeout(0);
    this.reference.current!.readOnly = false;
  };

  /**
   * Returns text field default value.
   */
  public static getDefaultValue = () => "";
}

/**
 * Text field label component props.
 */
interface TextFieldLabel {
  /**
   * Whether or not use placeholder style.
   */
  placeholderStyle: boolean;
}

/**
 * Text field label that acts like a placeholder if input is empty and not focused.
 */
const TextFieldLabel = styled(Label)<TextFieldLabel>`
  ${props =>
    props.placeholderStyle &&
    css`
      top: 0;
      height: 100%;
      background-color: transparent;
      font-size: inherit;
      font-weight: inherit;
      letter-spacing: inherit;
    `}
`;

/**
 * Input component into which user enters the text.
 */
const Input = styled.input`
  ${RESET};

  width: 100%;
  height: 100%;

  padding: 0 ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;

  color: ${({ theme }) => theme.colorPrimary};
`;
