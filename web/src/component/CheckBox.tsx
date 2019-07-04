import * as React from "react";
import styled from "styled-components";
import { InputChangeHandler } from "./Input";
import { DURATION, TIMING_FUNCTION } from "../styling/animations";
import { DEFAULT_BORDER, ACTIVE, DEFAULT_LABEL } from "../styling/colors";
import { UNIT } from "../styling/sizes";
import { RESET } from "../styling/stylesheets";

/**
 * Check box component props.
 */
interface CheckBoxProps {
  /**
   * Label text that will be shown next to the checkbox.
   */
  label?: string;

  /**
   * Check box name that will be included as one of the `onChange` callback
   * parameters.
   */
  name: string;

  /**
   * Function that will be called when check box' state changes.
   */
  onChange?: InputChangeHandler<boolean>;

  /**
   * Whether or not checkbox is checked.
   */
  value: boolean;
}

/**
 * Two state selection usually used to define if something is true or false.
 */
export class CheckBox extends React.Component<CheckBoxProps> {
  /**
   * Renders real checkbox and fake one on top of it, alongside label text, if
   * defined.
   */
  public render() {
    const { label, value } = this.props;

    return (
      <Label>
        <Input checked={value} onChange={this.handleChange} type="checkbox" />
        <Box>
          <Check />
        </Box>
        {label !== undefined && <Text>{label}</Text>}
      </Label>
    );
  }

  /**
   * Calls `onChange` callback prop if exists on real check box state change.
   */
  private handleChange = () => {
    if (this.props.onChange === undefined) {
      return;
    }

    this.props.onChange(this.props.name, !this.props.value);
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

  height: ${UNIT}rem;

  cursor: pointer;
`;

/**
 * Box component that contains the `Check` component.
 */
const Box = styled.div`
  position: absolute;
  top: ${UNIT / 4}rem;

  width: ${UNIT}rem;
  height: ${UNIT / 2}rem;

  color: ${DEFAULT_BORDER};
  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: ${UNIT / 4}rem;

  transition: ${DURATION}s ${TIMING_FUNCTION};

  pointer-events: none;
`;

/**
 * Circle shaped component that if check box is unchecked is on the left, and if
 * checked moves to the right.
 */
const Check = styled.div`
  position: absolute;
  left: 0;

  width: ${(6 * UNIT) / 16}rem;
  height: ${(6 * UNIT) / 16}rem;

  margin: ${UNIT / 16}rem;

  color: inherit;
  box-shadow: inherit;
  border-radius: inherit;

  transition: inherit;
`;

/**
 * Text component that displays label text after the check box.
 */
const Text = styled.div`
  color: ${DEFAULT_LABEL};
  padding-left: ${UNIT / 4}rem;
`;

/**
 * Real check box onto which fake one is rendered.
 */
const Input = styled.input`
  ${RESET};

  width: ${UNIT}rem;
  height: ${UNIT}rem;

  opacity: 0;

  cursor: inherit;

  &:checked + ${Box} > ${Check} {
    left: ${UNIT / 2}rem;
  }

  &:focus ~ * {
    color: ${ACTIVE};
  }
`;
