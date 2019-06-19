import { ErrorReason } from "api";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled, { css } from "styled-components";
import {
  DEFAULT_BORDER,
  ERROR,
  DEFAULT_LABEL,
  ACTIVE,
  BACKGROUND
} from "../styling/colors";
import { UNIT, BORDER_RADIUS } from "../styling/sizes";
import { TRANSITION } from "../styling/animations";
import { InjectedProps } from "../store";

/**
 * Input value change callback function type.
 */
export interface InputChangeHandler<TName extends InputName> {
  (name: TName, value: string): void;
}

/**
 * Union of all supported input names.
 */
export type InputName = "email" | "password";

/**
 * Union of all supported input types.
 */
export type InputType = "text" | "email" | "password" | "number";

/**
 * Mapping between input name and its type.
 */
const NAME_TO_TYPE: { [N in InputName]: InputType } = {
  email: "email",
  password: "password"
};

/**
 * Input component properties.
 */
interface InputProps<TName extends InputName> {
  /**
   * Boolean whether or not this input should be in the focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Name of this input. Used as one of the callback function arguments.
   */
  name: TName;

  /**
   * Change callback function.
   */
  onChange?: InputChangeHandler<TName>;

  /**
   * Error reason, which is used to display translated error message.
   *
   * If reason is not `undefined`, some of the input components will also be
   * colored red.
   */
  reason?: ErrorReason;

  /**
   * The value within the input.
   */
  value: string;
}

/**
 * Input component that allows user to enter single line of text.
 */
@inject("translations")
@observer
export class Input<TName extends InputName> extends React.Component<
  InputProps<TName> & InjectedProps
> {
  /**
   * Cache of previous property `reason` value so that error text does not
   * disappear abruptly when error is gone.
   */
  private reason?: ErrorReason;

  public render() {
    const { autoFocus, name, reason, translations, value } = this.props;

    if (reason !== undefined) {
      this.reason = reason;
    }

    const { placeholder, reasons } = translations!.translation.inputs[name];

    const message =
      this.reason === undefined ? undefined : reasons[this.reason];

    return (
      <Container>
        <InputElement
          autoFocus={autoFocus}
          hasError={reason !== undefined}
          name={name}
          onChange={this.handleChange}
          type={NAME_TO_TYPE[name]}
          value={value}
        />

        <Border />

        <Placeholder>{placeholder}</Placeholder>

        {message !== undefined && <Error>{message}</Error>}
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

    this.props.onChange(this.props.name, event.target.value);
  };
}

/**
 * Container component that contains all other components.
 */
const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${UNIT}rem;
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
  top: ${UNIT / 8}rem;

  width: 100%;
  height: ${(3 * UNIT) / 4}rem;

  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: ${BORDER_RADIUS}rem;
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
  top: ${UNIT / 8}rem;

  height: ${(3 * UNIT) / 4}rem;

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

  height: ${UNIT / 4}rem;

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
  top: ${UNIT / 8}rem;

  width: 100%;
  height: ${(3 * UNIT) / 4}rem;

  padding: 0 1rem;
  box-sizing: border-box;

  ${TRANSITION};

  &:focus + * + ${Placeholder},
  &:not([value=""]) + * + ${Placeholder},
  /* Fix for Firefox's invalid number inputs having empty value */
  &[type="number"]:invalid + * + ${Placeholder} {
    top: 0;
    height: ${UNIT / 4}rem;

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
