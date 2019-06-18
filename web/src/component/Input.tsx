import * as React from "react";
import styled, { css } from "styled-components";
import {
  DEFAULT_BORDER,
  ERROR,
  DEFAULT_LABEL,
  ACTIVE,
  BACKGROUND
} from "../styling/colors";
import { UNIT_HEIGHT } from "../styling/sizes";
import { TRANSITION } from "../styling/animations";

/**
 * Input value change callback function type.
 */
export interface ChangeHandler {
  (name: string, value: string): void;
}

/**
 * Input type type.
 */
export type Type = "text" | "email" | "password" | "number";

/**
 * Input component properties.
 */
interface Props {
  /**
   * Error message which will be shown under the input field.
   *
   * If message is not `undefined`, some of the input components will also be
   * colored red.
   */
  error?: string;

  /**
   * Name of this input. Used as one of the callback function arguments.
   */
  name: string;

  /**
   * Change callback function.
   */
  onChange?: ChangeHandler;

  /**
   * Placeholder/label text.
   */
  placeholder?: string;

  /**
   * Input type.
   */
  type: Type;

  /**
   * The value within the input.
   */
  value: string;
}

/**
 * Input component that allows user to enter single line of text.
 */
export class Input extends React.Component<Props> {
  /**
   * Cache of previous property `error` value so that error text does not
   * disappear abruptly when error is gone.
   */
  private error?: string;

  public render() {
    const { error, name, placeholder, type, value } = this.props;

    if (error !== undefined) {
      this.error = error;
    }

    return (
      <Container>
        <InputElement
          hasError={error !== undefined}
          name={name}
          onChange={this.handleChange}
          type={type}
          value={value}
        />

        <Border />
        {placeholder !== undefined && <Placeholder>{placeholder}</Placeholder>}
        <Error>{this.error}</Error>
      </Container>
    );
  }

  /**
   * Relays actual input event handler callback value to our own change callback
   * function.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.onChange === undefined) {
      return;
    }

    this.props.onChange(event.target.name, event.target.value);
  };
}

/**
 * Container component that contains all other components.
 */
export const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${UNIT_HEIGHT}rem;
`;

/**
 * Border element responsible for drawing a border around the input component.
 *
 * The border is not around the actual input component because when the input is
 * resized (making it possible to add other components next to the input without
 * overlap), so is it's border, which is not desired behavior.
 */
const Border = styled.div`
  position: absolute;
  top: 0.5rem;

  width: 100%;
  height: ${UNIT_HEIGHT - 1}rem;

  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: 0.25rem;
  box-sizing: border-box;

  pointer-events: none;

  ${TRANSITION}
`;

/**
 * Text element, which acts like a placeholder if input is empty and not
 * focused, or a label.
 */
const Placeholder = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 0.5rem;

  height: ${UNIT_HEIGHT - 1}rem;

  padding: 0 0.25rem;
  box-sizing: border-box;

  display: flex;
  align-items: center;

  pointer-events: none;

  ${TRANSITION}
`;

/**
 * The error message at the bottom of the input.
 */
const Error = styled.div`
  position: absolute;
  left: 0.75rem;
  bottom: 0;

  display: flex;
  align-items: center;

  height: 1rem;

  padding: 0 0.25rem;
  box-sizing: border-box;

  background-color: ${BACKGROUND};
  color: ${ERROR};
  font-size: 0.75rem;
  letter-spacing: 0;

  pointer-events: none;

  ${TRANSITION}
`;

/**
 * Color styling of input and its sub-components when property `error` is not
 * `undefined`.
 */
const defaultColors = css`
  & + ${Border} {
    color: ${DEFAULT_BORDER};
  }

  & + * + ${Placeholder} {
    color: ${DEFAULT_LABEL};
  }

  &:focus + ${Border}, &:focus + * + ${Placeholder} {
    color: ${ACTIVE};
  }
`;

/**
 * Color styling of input and its sub-components when property `error` is
 * `undefined`.
 */
const errorColors = css`
  & + ${Border}, & + * + ${Placeholder} {
    color: ${ERROR};
  }
`;

/**
 * Actual input element properties.
 */
interface InputElementProps {
  /**
   * Boolean value that shows whether or not there is an error.
   */
  hasError: boolean;
}

/**
 * The actual input element into which text is inputted.
 */
const InputElement = styled.input<InputElementProps>`
  /* Reset */
  border: none;
  outline: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;

  position: absolute;
  top: 0.5rem;

  width: 100%;
  height: ${UNIT_HEIGHT - 1}rem;

  padding: 0 1rem;
  box-sizing: border-box;

  ${TRANSITION};

  &:focus + * + ${Placeholder},
  &:not([value=""]) + * + ${Placeholder},
  /* Fix for Firefox's invalid number inputs having empty value */
  &[type="number"]:invalid + * + ${Placeholder} {
    top: 0;
    height: 1rem;

    background-color: ${BACKGROUND};
    font-size: 0.75rem;
    letter-spacing: 0;
  }

  & + * + ${Error}, & + * + * + ${Error} {
    opacity: ${props => (props.hasError ? 1 : 0)};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  ${props => (props.hasError ? errorColors : defaultColors)};
`;
