import { observable, action } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { InputWrapper } from "./InputWrapper";
import { styled, StyleProps } from "../styling/theme";
import { RESET } from "../styling/stylesheets";

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
   * Whether or not should field use underline style.
   */
  underline?: boolean;

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
  "CheckBox",
  CheckBoxProps<TName>
> {
  /**
   * Whether or not check box is focused.
   */
  @observable private focused = false;

  /**
   * Sets the name of this component.
   */
  public constructor(props: CheckBoxProps<TName>) {
    super("CheckBox", props);
  }

  /**
   * Renders a check box on its own if `basic` props is true, otherwise renders
   * the check box inside `InputWrapper` component.
   */
  public render() {
    const {
      basic,
      disabled,
      errorMessage,
      invalid,
      label,
      underline
    } = this.props;

    if (basic) {
      return this.renderCheckBox();
    }

    return (
      <InputWrapper
        active={this.focused}
        disabled={disabled}
        errorMessage={errorMessage}
        input={this.renderCheckBox()}
        invalid={invalid}
        label={label}
        underline={underline}
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
interface CheckBoxStateProps extends StyleProps {
  /**
   * Whether or not check box is checked.
   */
  checked?: boolean;
}

/**
 * Container that contains both real and fake check boxes.
 */
const Box = styled.div<CheckBoxStateProps>`
  position: relative;

  width: calc(${({ theme }) => theme.height} / 2);
  height: calc(${({ theme }) => theme.height} / 2);

  flex: 0 0 auto;

  color: ${({ active, checked, invalid, theme }) =>
    invalid ? theme.red : active || checked ? theme.orange : theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: inset 0 0 0
    ${({ active, checked, invalid, theme }) =>
      checked ? theme.padding : active || invalid ? "2px" : "1px"};

  transition: ${({ theme }) => theme.transition};
`;

/**
 * The real invisible check box that is being checked/unchecked on top of which
 * fake one is rendered.
 */
const Input = styled.input`
  ${RESET};

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

  width: calc(${({ theme }) => theme.height} / 12);
  height: calc(${({ theme }) => theme.height} / 6);

  border-bottom: calc(${({ theme }) => theme.padding} / 12) solid;
  border-right: calc(${({ theme }) => theme.padding} / 12) solid;

  color: ${({ invalid, theme }) =>
    invalid ? theme.backgroundColor : theme.primaryColor};

  transition: ${({ theme }) => theme.transition};

  pointer-events: none;
`;
