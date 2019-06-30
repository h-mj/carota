import { ErrorReasons, Languages, Units } from "api";
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
import { TIMING_FUNCTION, TRANSITION_DURATION } from "../styling/animations";
import { InjectedProps } from "../store";
import { RESET } from "../styling/stylesheets";

/**
 * Input value change callback function type.
 */
export interface InputChangeHandler<TName extends InputNames> {
  (name: TName, value: string): void;
}

/**
 * Union of all input names.
 */
export type InputNames = TextInputNames | SwitchInputNames;

/**
 * Union of text input names.
 */
export type TextInputNames =
  | "barcode"
  | "carbohydrate"
  | "email"
  | "energy"
  | "fat"
  | "fibre"
  | "monoUnsaturates"
  | "name"
  | "password"
  | "polyols"
  | "polyunsaturates"
  | "protein"
  | "salt"
  | "saturates"
  | "starch"
  | "sugars";

/**
 * Union of text input types.
 */
type TextInputTypes = "text" | "email" | "password" | "number";

/**
 * Object that maps switch input names to their options types.
 */
export interface SwitchInputOptions {
  language: Languages;
  unit: Units;
}

/**
 * Object that maps switch input name to array of its all options.
 */
const SWITCH_INPUT_OPTIONS: Readonly<
  { [InputName in SwitchInputNames]: Array<SwitchInputOptions[InputName]> }
> = {
  language: ["Estonian", "English", "Russian"],
  unit: ["g", "ml"]
};

/**
 * Union of switch input names.
 */
export type SwitchInputNames = keyof SwitchInputOptions;

/**
 * Mapping between input name and its type.
 */
const TEXT_INPUT_NAME_TO_TYPE: Readonly<
  { [InputName in TextInputNames]: TextInputTypes }
> = {
  barcode: "number",
  carbohydrate: "number",
  email: "email",
  energy: "number",
  fat: "number",
  fibre: "number",
  monoUnsaturates: "number",
  name: "text",
  password: "password",
  polyols: "number",
  polyunsaturates: "number",
  protein: "number",
  salt: "number",
  saturates: "number",
  starch: "number",
  sugars: "number"
};

/**
 * Type of the value input named `TInputName` contains.
 */
export type InputValueType<
  TInputName extends InputNames
> = TInputName extends SwitchInputNames
  ? SwitchInputOptions[TInputName] | ""
  : string;

/**
 * Input component properties.
 */
interface InputProps<TInputName extends InputNames> {
  /**
   * Whether or not this input should be in the focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Whether or not only the input component itself should be rendered.
   */
  basic?: boolean;

  /**
   * Name of this input. Used as one of the callback function arguments.
   */
  name: TInputName;

  /**
   * Change callback function.
   */
  onChange?: InputChangeHandler<TInputName>;

  /**
   * Error reason, which is used to display translated error message.
   *
   * If reason is defined, some of the input sub-components will be colored red.
   */
  reason?: ErrorReasons;

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
export class Input<TInputName extends InputNames> extends React.Component<
  InputProps<TInputName> & InjectedProps
> {
  /**
   * Cache of previous property `reason` value so that error text does not
   * disappear abruptly when error is gone.
   */
  private reason?: ErrorReasons;

  /**
   * Renders this component.
   */
  public render() {
    const { basic, name, reason, translations } = this.props;

    if (reason !== undefined) {
      this.reason = reason;
    }

    if (basic === true) {
      return this.renderInput();
    }

    const { placeholder, reasons } = translations!.translation.inputs[name];

    const message =
      this.reason === undefined ? undefined : reasons[this.reason];

    return (
      <Container>
        {this.renderInput()}
        <Border />
        <Placeholder>{placeholder}</Placeholder>
        {message !== undefined && <Error>{message}</Error>}
      </Container>
    );
  }

  /**
   * Renders the actual input component.
   */
  private renderInput = () =>
    this.props.name in SWITCH_INPUT_OPTIONS
      ? this.renderSwitchInput(this.props.name as SwitchInputNames)
      : this.renderTextInput(this.props.name as TextInputNames);

  /**
   * Renders a text input named `name`.
   *
   * @param name Name of the text input.
   */
  private renderTextInput(name: TextInputNames) {
    const { autoFocus, basic, reason, value } = this.props;

    return (
      <TextInputElement
        autoFocus={autoFocus}
        basic={basic === true}
        hasError={reason !== undefined}
        name={name}
        onChange={this.handleChange}
        type={TEXT_INPUT_NAME_TO_TYPE[name]}
        value={value}
      />
    );
  }

  /**
   * Renders a switch input named `name` with its options.
   *
   * @param name Name of the switch input.
   */
  private renderSwitchInput(name: SwitchInputNames) {
    const { basic, reason, value, translations } = this.props;

    return (
      <SwitchInputElement
        basic={basic === true}
        hasError={reason !== undefined}
      >
        {(SWITCH_INPUT_OPTIONS[name] as any).map((option: any) => (
          <Option
            hasError={reason !== undefined}
            key={option}
            onClick={this.handleChange}
            isSelected={option === value}
            type="button"
            value={option}
          >
            {(translations!.translation.inputs[name].options as any)[option]}
          </Option>
        ))}
      </SwitchInputElement>
    );
  }

  /**
   * Relays actual input event handler callback value to our own change callback
   * function.
   */
  private handleChange: React.EventHandler<any> = event => {
    if (this.props.onChange === undefined) {
      return;
    }

    this.props.onChange(this.props.name, event.target.value);
  };
}

/**
 * Container component that contains all input sub-components.
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

  width: 100%;
  height: 100%;

  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: ${BORDER_RADIUS}rem;

  pointer-events: none;

  transition: ${TRANSITION_DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Text element, which acts like a placeholder if input is empty and not
 * focused, or a label.
 */
const Placeholder = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  height: 100%;

  padding: 0 ${UNIT / 12}rem;
  box-sizing: border-box;

  display: flex;
  align-items: center;

  white-space: nowrap;

  pointer-events: none;

  transition: ${TRANSITION_DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Extra placeholder style if it is in label state.
 */
const labelStyle = css`
  top: -${UNIT / 8}rem;
  height: ${UNIT / 4}rem;

  background-color: ${BACKGROUND};

  font-size: 0.75rem;
  letter-spacing: 0;
`;

/**
 * The error message at the bottom of the input.
 */
const Error = styled.div`
  position: absolute;
  bottom: -${UNIT / 8}rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;

  height: ${UNIT / 4}rem;

  padding: 0 ${UNIT / 12}rem;
  box-sizing: border-box;

  background-color: ${BACKGROUND};

  color: ${ERROR};
  font-size: 0.75rem;
  letter-spacing: 0;
  white-space: nowrap;

  pointer-events: none;

  transition: ${TRANSITION_DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Color styling of input and its sub-components when there are no errors.
 */
const defaultColors = css`
  & + ${Border} {
    color: ${DEFAULT_BORDER};
  }

  & + * + ${Placeholder} {
    color: ${DEFAULT_LABEL};
  }

  &:focus + ${Border},
  &:focus + * + ${Placeholder},
  /* Also make colors active if one of the options is focused */
  &:focus-within + ${Border},
  &:focus-within + * + ${Placeholder} {
    color: ${ACTIVE};
  }
`;

/**
 * Color styling of input and its sub-components when error reason is defined.
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
   * Whether or not only input component is rendered.
   */
  basic: boolean;

  /**
   * Whether or not there is an error.
   */
  hasError: boolean;
}

/**
 * Style that is shared between all types of inputs.
 */
const inputElementStyle = css<InputElementProps>`
  position: ${props => (props.basic ? "initial" : "absolute")};

  width: 100%;
  height: 100%;

  transition: ${TRANSITION_DURATION}s ${TIMING_FUNCTION};

  & + * + ${Error}, & + * + * + ${Error} {
    opacity: ${props => (props.hasError ? 1 : 0)};
  }

  ${props => (props.hasError ? errorColors : defaultColors)};
`;

/**
 * The actual text input element into which text is inputted.
 */
const TextInputElement = styled.input<InputElementProps>`
  ${RESET};
  ${inputElementStyle};

  flex: 1;

  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  text-align: ${props => (props.basic ? "right" : "left")};

  &:focus + * + ${Placeholder},
  &:not([value=""]) + * + ${Placeholder},
  /* Fix for Firefox's invalid number inputs having empty value */
  &[type="number"]:invalid + * + ${Placeholder} {
    ${labelStyle};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

/**
 * Option component properties.
 */
interface OptionProps {
  /**
   * Whether or not there is an error.
   */
  hasError: boolean;

  /**
   * Whether or not this option is selected.
   */
  isSelected: boolean;
}

/**
 * Option component that is within `SwitchInputElement` component.
 */
const Option = styled.button<OptionProps>`
  ${RESET};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: ${props =>
    props.isSelected ? ACTIVE : props.hasError ? ERROR : DEFAULT_LABEL};

  cursor: pointer;

  transition: ${TRANSITION_DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Switch input element that lets user to choose between one of the options
 * within this component.
 */
const SwitchInputElement = styled.div<InputElementProps>`
  ${inputElementStyle}

  display: flex;

  & + * + ${Placeholder} {
    ${labelStyle};
  }
`;
