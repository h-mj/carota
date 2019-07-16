import * as React from "react";
import { Component } from "../Component";
import { InputChangeHandler } from "./Input";
import { TRANSITION } from "../../styling/animations";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { RESET } from "../../styling/stylesheets";
import { getState, styled, StateProps } from "../../styling/theme";

/**
 * Check box component props.
 */
interface CheckBoxProps {
  /**
   * Whether or not this check box is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not this check box is invalid.
   */
  invalid?: boolean;

  /**
   * Label text that will be rendered next to the check box.
   */
  label?: string;

  /**
   * Name of the check box that will be included in parameters of `onChange`
   * callback function.
   */
  name: string;

  /**
   * Function that will be called when check box' state changes.
   */
  onChange?: InputChangeHandler<boolean>;

  /**
   * Whether or not check box must be selected.
   */
  required?: boolean;

  /**
   * Whether or not check box is checked.
   */
  value: boolean;
}

/**
 * Two state selection usually used to define if something is true or false.
 */
export class CheckBox extends Component<CheckBoxProps> {
  /**
   * Renders real checkbox and fake one on top of it, alongside label text, if
   * defined.
   */
  public render() {
    const { disabled, invalid, label, value } = this.props;
    const state = getState(disabled, value, invalid);

    return (
      <Label>
        <Input
          checked={value}
          disabled={disabled}
          onChange={this.handleChange}
          type="checkbox"
        />
        <Box state={state}>
          <Check selected={value} />
        </Box>
        {label !== undefined && <Text state={state}>{label}</Text>}
      </Label>
    );
  }

  /**
   * Calls `onChange` callback prop if exists on real check box state change.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = () => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(this.props.name, !this.props.value);
    }
  };
}

/**
 * Component that contains all other components, including real and fake check
 * boxes and label text component.
 */
const Label = styled.label`
  position: relative;

  display: flex;
  align-items: center;

  height: ${UNIT_HEIGHT}rem;

  cursor: pointer;
`;

/**
 * Box component that contains the `Check` component.
 */
const Box = styled.div<StateProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  width: ${UNIT_HEIGHT}rem;
  height: ${UNIT_HEIGHT / 2}rem;

  color: ${props => props.theme.states[props.state].borderColor};
  box-shadow: 0 0 0
      ${props =>
        props.state === "disabled" || props.state === "default" ? 0.5 : 1}px,
    inset 0 0 0
      ${props =>
        props.state === "disabled" || props.state === "default" ? 0.5 : 1}px;
  border-radius: ${UNIT_HEIGHT / 4}rem;

  background-color: ${props => props.theme.states[props.state].backgroundColor};

  transition: ${TRANSITION};

  pointer-events: none;
`;

/**
 * Check component props.
 */
interface CheckProps {
  /**
   * Whether or not check box is selected.
   */
  selected: boolean;
}

/**
 * Circle shaped component that if check box is unchecked is on the left, and if
 * checked moves to the right.
 */
const Check = styled.div<CheckProps>`
  position: absolute;
  top: 0;
  left: ${props => (props.selected ? "50%" : 0)};

  width: ${UNIT_HEIGHT / 2}rem;
  height: ${UNIT_HEIGHT / 2}rem;

  color: inherit;
  box-shadow: inherit;
  border-radius: inherit;

  transition: ${TRANSITION};
`;

/**
 * Text component that displays label text after the check box.
 */
const Text = styled.div<StateProps>`
  color: ${props => props.theme.states[props.state].color};
  margin-left: ${UNIT_HEIGHT / 4}rem;
`;

/**
 * Real check box onto which fake one is rendered.
 */
const Input = styled.input`
  ${RESET};

  width: ${UNIT_HEIGHT}rem;
  height: ${UNIT_HEIGHT}rem;

  opacity: 0;

  cursor: inherit;
`;
