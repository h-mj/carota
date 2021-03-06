import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { InputStyleProps, InputWrapper } from "./InputWrapper";

/**
 * Select component props.
 */
interface SelectProps<TName extends string, TValues extends string> {
  /**
   * Whether or not render only options component.
   */
  basic?: boolean;

  /**
   * Whether or not select is disabled.
   */
  disabled?: boolean;

  /**
   * Error message text that will be rendered under the select.
   */
  errorMessage?: string;

  /**
   * Helper message that will be rendered above the the select.
   */
  helperMessage?: string;

  /**
   * Whether or not select is invalid.
   */
  invalid?: boolean;

  /**
   * Label text that will be rendered next to the select options.
   */
  label?: string;

  /**
   * Name of the select that will be included in parameters of `onChange`
   * callback function.
   */
  name: TName;

  /**
   * Function that will be called when selected option changes.
   */
  onChange?: (name: TName, value: TValues | undefined) => void;

  /**
   * Function that will be called when focus state of any option changes.
   */
  onFocusChange?: (name: TName, focus: boolean) => void;

  /**
   * Array of label-value pairs, where `label` will be visible to the user and
   * `value` is internal representation of the option.
   */
  options: readonly { label: string; value: TValues }[];

  /**
   * Whether or not text field is read only.
   */
  readOnly?: boolean;

  /**
   * Whether or not an option must be selected.
   */
  required?: boolean;

  /**
   * Selected option value.
   */
  value: TValues | undefined;
}

/**
 * Component that allows user to select between finite array of options.
 */
@observer
export class Select<
  TName extends string = string,
  TValues extends string = string
> extends Component<SelectProps<TName, TValues>> {
  /**
   * Whether one of the options is focused.
   */
  @observable private focused = false;

  /**
   * Renders the option optionally alongside field, label and error message
   * components.
   */
  public render() {
    const {
      basic,
      disabled,
      errorMessage,
      helperMessage,
      invalid,
      label,
    } = this.props;

    if (basic) {
      return this.renderOptions();
    }

    return (
      <InputWrapper
        active={this.focused}
        disabled={disabled}
        errorMessage={errorMessage}
        helperMessage={helperMessage}
        input={this.renderOptions()}
        invalid={invalid}
        label={label}
      />
    );
  }

  /**
   * Renders options component.
   */
  private renderOptions() {
    const { disabled, invalid, options, value } = this.props;

    if (options === undefined) {
      return null;
    }

    return (
      <Options active={this.focused} invalid={invalid}>
        {options.map(({ label: optionLabel, value: optionValue }) => (
          <Option
            key={optionValue}
            disabled={disabled}
            onBlur={this.handleFocusChange}
            onClick={this.handleClick}
            onFocus={this.handleFocusChange}
            selected={value === optionValue}
            type="button"
            value={optionValue}
          >
            <OptionLabel title={optionLabel}>{optionLabel}</OptionLabel>
          </Option>
        ))}
      </Options>
    );
  }

  /**
   * Calls `onChange` callback function prop when one of the options is clicked.
   */
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const { name, onChange, value } = this.props;

    if (onChange === undefined) {
      return;
    }

    const targetValue = event.currentTarget.value as TValues;
    onChange(name, value === targetValue ? undefined : targetValue);
  };

  /**
   * Updates `focused` value and calls `onFocusChange` callback function on
   * focus change of any option elements.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<HTMLButtonElement> = (
    event
  ) => {
    this.focused = event.type === "focus";

    const { name, onFocusChange } = this.props;

    if (onFocusChange === undefined) {
      return;
    }

    onFocusChange(name, this.focused);
  };
}

/**
 * Component that contains option components.
 */
const Options = styled.div<InputStyleProps>`
  display: flex;

  min-width: 0;
  width: 100%;
  height: 100%;

  transition: ${({ theme }) => theme.transition};
`;

/**
 * Option component props.
 */
interface OptionProps extends InputStyleProps {
  /**
   * Whether or not this option is selected.
   */
  selected?: boolean;
}

/**
 * One of the options between which selection is made.
 */
const Option = styled.button<OptionProps>`
  ${RESET};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: ${({ selected, theme }) =>
    selected ? theme.colorPrimary : theme.colorSecondary};

  cursor: pointer;

  transition: ${({ theme }) => theme.transition};
`;

/**
 * Container that contains option label text.
 */
const OptionLabel = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  padding: 0 ${({ theme }) => theme.paddingSecondaryHalf};
  box-sizing: border-box;
`;
