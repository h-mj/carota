import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { InputStyleProps, InputWrapper } from "./InputWrapper";

/**
 * Check box component props.
 */
interface CheckBoxProps<TName extends string> {
  /**
   * Whether or not check box should be automatically in focus.
   */
  autoFocus?: boolean;

  /**
   * Whether or not only render check box.
   */
  basic?: boolean;

  /**
   * Whether or not check box is disabled.
   */
  disabled?: boolean;

  /**
   * Error message text that will be rendered under the check box field.
   */
  errorMessage?: string;

  /**
   * Helper message that will be rendered above the the check box field.
   */
  helperMessage?: string;

  /**
   * Whether or not check box is invalid.
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
  name: TName;

  /**
   * Function that will be called when check box' checked state changes.
   */
  onChange?: (name: TName, value: boolean) => void;

  /**
   * Function that will be called when check box focus changes.
   */
  onFocusChange?: (name: TName, focus: boolean) => void;

  /**
   * Whether or not check box is read only.
   */
  readOnly?: boolean;

  /**
   * Whether or not check box must be checked.
   */
  required?: boolean;

  /**
   * Whether or not check box is checked.
   */
  value: boolean;
}

/**
 * Control component that is either `true` or `false` based on whether or not it
 * is checked or not.
 */
@observer
export class CheckBox<TName extends string = string> extends Component<
  CheckBoxProps<TName>
> {
  /**
   * Whether or not check box is focused.
   */
  @observable private focused = false;

  /**
   * Renders a check box on its own if `basic` props is true, otherwise renders
   * the check box inside `InputWrapper` component.
   */
  public render() {
    const {
      basic,
      disabled,
      errorMessage,
      helperMessage,
      invalid,
      label
    } = this.props;

    if (basic) {
      return this.renderCheckBox();
    }

    return (
      <InputWrapper
        active={this.focused}
        disabled={disabled}
        errorMessage={errorMessage}
        helperMessage={helperMessage}
        input={this.renderCheckBox()}
        invalid={invalid}
        label={label}
        withLabel={true}
      />
    );
  }

  /**
   * Renders the check box.
   */
  private renderCheckBox() {
    const {
      autoFocus,
      disabled,
      invalid,
      name,
      readOnly,
      required,
      value
    } = this.props;

    return (
      <Box active={this.focused} checked={value} invalid={invalid}>
        <Input
          autoFocus={autoFocus}
          checked={value}
          disabled={disabled}
          name={name}
          readOnly={readOnly}
          required={required}
          onBlur={this.handleFocusChange}
          onChange={this.handleChange}
          onFocus={this.handleFocusChange}
          type="checkbox"
        />
        <Check active={this.focused} checked={value} invalid={invalid} />
      </Box>
    );
  }

  /**
   * Calls `onChange` callback function prop whenever check box' checked state
   * changes.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const { name, onChange } = this.props;

    if (onChange === undefined) {
      return;
    }

    onChange(name, event.currentTarget.checked);
  };

  /**
   * Updates `focused` value and calls `onFocusChange` callback function on
   * focus change of check box.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<
    HTMLInputElement
  > = event => {
    this.focused = event.type === "focus";

    const { name, onFocusChange } = this.props;

    if (onFocusChange === undefined) {
      return;
    }

    onFocusChange(name, this.focused);
  };
}

/**
 * Props that affect the styling of `Box` and `Check` components.
 */
interface CheckBoxStateProps extends InputStyleProps {
  /**
   * Whether or not check box is checked.
   */
  checked?: boolean;
}

/**
 * Container that contains both real and fake check boxes.
 */
// prettier-ignore
const Box = styled.div<CheckBoxStateProps>`
  position: relative;

  width: ${({ theme }) => theme.heightHalf};
  height: ${({ theme }) => theme.heightHalf};

  flex: 0 0 auto;

  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: inset 0 0 0 ${({ active, invalid }) => (active || invalid ? "2px" : "1px")} ${({ active, invalid, theme }) => invalid ? theme.colorRed : active ? theme.colorOrange : theme.borderColor};

  transition: ${({ theme }) => theme.transition};
`;

/**
 * The real invisible check box that is being checked/unchecked on top of which
 * fake one is rendered.
 */
const Input = styled.input`
  ${RESET};

  position: absolute;

  width: 100%;
  height: 100%;

  opacity: 0;

  cursor: pointer;
`;

/**
 * Check mark component inside the box component.
 */
const Check = styled.div<CheckBoxStateProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) rotateZ(45deg)
    scale(${({ checked }) => (checked ? 1 : 0)});

  width: calc(${({ theme }) => theme.height} / 14);
  height: calc(${({ theme }) => theme.height} / 7);

  border-bottom: calc(${({ theme }) => theme.padding} / 12) solid;
  border-right: calc(${({ theme }) => theme.padding} / 12) solid;

  color: ${({ theme }) => theme.colorPrimary};

  transition: ${({ theme }) => theme.transition};

  pointer-events: none;
`;
