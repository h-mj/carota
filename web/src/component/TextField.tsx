import * as React from "react";
import styled, { css } from "styled-components";
import {
  DURATION,
  fadeIn,
  fadeOut,
  TIMING_FUNCTION
} from "../styling/animations";
import {
  ACTIVE,
  BACKGROUND,
  DEFAULT_BORDER,
  DEFAULT_LABEL,
  ERROR
} from "../styling/colors";
import { BORDER_RADIUS, UNIT } from "../styling/sizes";
import { RESET } from "../styling/stylesheets";

/**
 * Union of all text field types.
 */
export type TextFieldType = "email" | "number" | "password" | "tel" | "text";

/**
 * Text field component props.
 */
export interface TextFieldProps {
  /**
   * Whether or not this input should be in the focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Error message which will be shown under the text field.
   */
  error?: string;

  /**
   * Text field name that will be included as one of the `onChange` callback
   * parameters.
   */
  name: string;

  /**
   * Function that will be called when text field value changes.
   */
  onChange?: (name: string, value: string) => void;

  /**
   * Placeholder text that will be shown inside text field if text field is
   * empty and not focused or above otherwise.
   */
  placeholder?: string;

  /**
   * Text field input type.
   */
  type: TextFieldType;

  /**
   * Text field value.
   */
  value?: string;
}

/**
 * Component that allows user to enter single line of text.
 */
export class TextField extends React.Component<TextFieldProps> {
  /**
   * Last defined `error` prop value that is used as error message if `error`
   * prop is `undefined` but we still want to render `ErrorMessage` component.
   */
  private previousError?: string;

  /**
   * Updates `previousError` value when receiving potentially new props.
   */
  public componentWillReceiveProps(props: TextFieldProps) {
    if (props.error !== undefined) {
      this.previousError = props.error;
    }
  }

  /**
   * Renders text field component alongside the placeholder and error labels.
   */
  public render() {
    const { autoFocus, error, name, placeholder, type, value } = this.props;

    return (
      <Container>
        <Input
          autoFocus={autoFocus}
          hasError={error !== undefined}
          name={name}
          onChange={this.handleChange}
          type={type}
          value={value || ""}
        />
        {placeholder !== undefined && <Placeholder>{placeholder}</Placeholder>}
        {this.previousError !== undefined && (
          <ErrorMessage hasError={error !== undefined}>
            {this.previousError}
          </ErrorMessage>
        )}
      </Container>
    );
  }

  /**
   * Calls prop `onChange` if defined with input name and updated value.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(event.target.name, event.target.value);
    }
  };
}

/**
 * Container component that contains input, placeholder and error components.
 */
const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${UNIT}rem;
`;

/**
 * Base for `Error` and `Placeholder` components.
 */
export const Label = styled.div`
  position: absolute;
  top: -${UNIT / 8}rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;

  height: ${UNIT / 4}rem;

  padding: 0 ${UNIT / 12}rem;
  box-sizing: border-box;

  background-color: ${BACKGROUND};

  color: ${DEFAULT_LABEL};
  font-size: 0.75rem;
  letter-spacing: 0;
  white-space: nowrap;

  pointer-events: none;

  transition: ${DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Placeholder style if it's a label.
 */
const labelStyle = css`
  top: -${UNIT / 8}rem;
  height: ${UNIT / 4}rem;

  background-color: ${BACKGROUND};

  font-size: 0.75rem;
  letter-spacing: 0;
`;

/**
 * Label that displays the placeholder.
 */
const Placeholder = styled(Label)`
  top: 0;
  height: 100%;

  background-color: transparent;

  font-size: 1rem;
  letter-spacing: inherit;
`;

/**
 * Error component props.
 */
interface ErrorMessageProps {
  /**
   * Whether or not there's an error.
   */
  hasError: boolean;
}

/**
 * Label that displays an error message.
 */
export const ErrorMessage = styled(Label)<ErrorMessageProps>`
  top: initial;
  bottom: -${UNIT / 8}rem;
  color: ${ERROR};
  animation: ${props => (props.hasError ? fadeIn : fadeOut)} ${DURATION}s
    forwards;
`;

/**
 * Components coloring if there is no error.
 */
const defaultStyle = css`
  &:focus {
    box-shadow: 0 0 0 1px ${ACTIVE}, inset 0 0 0 1px ${ACTIVE};
  }

  &:focus + ${Placeholder} {
    color: ${ACTIVE};
  }
`;

/**
 * Components coloring if there is an error.
 */
const errorStyle = css`
  box-shadow: 0 0 0 1px ${ERROR}, inset 0 0 0 1px ${ERROR};

  & + ${Placeholder} {
    color: ${ERROR};
  }
`;

/**
 * Input component props.
 */
interface InputProps {
  /**
   * Whether or not there is an error.
   */
  hasError: boolean;
}

/**
 * Input component into which text is entered.
 */
const Input = styled.input<InputProps>`
  ${RESET};

  width: 100%;
  height: 100%;

  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  border-radius: ${BORDER_RADIUS}rem;
  box-shadow: 0 0 0 1px ${DEFAULT_BORDER}, inset 0 0 0 1px ${DEFAULT_BORDER};

  transition: ${DURATION}s ${TIMING_FUNCTION};

  &:focus + ${Placeholder},
  &:not([value=""]) + ${Placeholder},
  /* Fix for Firefox's invalid number inputs having empty value */
  &[type="number"]:invalid + ${Placeholder} {
    ${labelStyle};
  }

  /* Hide up/down arrows on the right of the input */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  ${props => (props.hasError ? errorStyle : defaultStyle)};
`;
