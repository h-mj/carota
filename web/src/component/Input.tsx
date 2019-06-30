import { ErrorReasons, Languages, Units } from "api";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { TextField, TextFieldType } from "./TextField";
import { Select } from "./Select";

/**
 * Union of all component names.
 */
export type InputNames = SelectNames | TextFieldNames;

/**
 * Type that maps select component name to type of its options.
 */
interface SelectOptions {
  language: Languages;
  unit: Units;
}

/**
 * Union of all select component names.
 */
type SelectNames = keyof SelectOptions;

/**
 * Object that is used to retrieve an array of option values by select component
 * name.
 */
const SELECT_OPTION_VALUES: Readonly<
  { [SelectName in SelectNames]: Array<SelectOptions[SelectName]> }
> = {
  language: ["Estonian", "English", "Russian"],
  unit: ["g", "ml"]
};

/**
 * Union of all text field component names.
 */
type TextFieldNames = "barcode" | "email" | "name" | "password";

/**
 * Object that maps text field name to its type.
 */
const TEXT_FIELD_TYPE: Readonly<
  { [TextFieldName in TextFieldNames]: TextFieldType }
> = {
  barcode: "tel",
  email: "email",
  name: "text",
  password: "password"
};

/**
 * Input component props.
 */
interface InputProps {
  /**
   * Whether or not this input should be in the focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Name of either `Select` or `TextField` component.
   */
  name: InputNames;

  /**
   * Function that will be called when input value changes.
   */
  onChange?: (name: string, value: string) => void;

  /**
   * Input value.
   */
  value: string;

  /**
   * Reason why an error related to this input occurred.
   */
  reason?: ErrorReasons;
}

/**
 * Input component translation.
 */
type InputsTranslation = {
  [InputName in InputNames]: InputName extends SelectNames
    ? SelectTranslation<InputName>
    : TextFieldTranslation
};

/**
 * General input component translation.
 */
interface InputTranslation {
  reasons: { [ErrorReason in ErrorReasons]?: string };
}

/**
 * Select input translation.
 */
interface SelectTranslation<SelectName extends SelectNames>
  extends InputTranslation {
  label: string;
  options: { [SelectOption in SelectOptions[SelectName]]: string };
}

/**
 * Text field translation.
 */
interface TextFieldTranslation extends InputTranslation {
  placeholder: string;
}

/**
 * Component that renders either `Select` or `TextField` component with
 * translated placeholder and error texts or translated label and error texts
 * alongside predefined and translated options respectively.
 */
@inject("translations")
@observer
export class Input extends Component<InputProps, InputsTranslation> {
  /**
   * Renders component that corresponds to `name` prop.
   */
  public render() {
    if (this.props.name in SELECT_OPTION_VALUES) {
      return this.renderSelect();
    } else {
      return this.renderTextField();
    }
  }

  /**
   * Renders a `Select` component.
   */
  private renderSelect() {
    const { name, onChange, value } = this.props;

    return (
      <Select
        error={this.error}
        label={this.translation[name as SelectNames].label}
        name={name}
        onChange={onChange}
        options={this.options}
        value={value}
      />
    );
  }

  /**
   * Renders a `TextField` component.
   */
  private renderTextField() {
    const { autoFocus, name, onChange, value } = this.props;

    return (
      <TextField
        autoFocus={autoFocus}
        error={this.error}
        name={name}
        onChange={onChange}
        placeholder={this.translation[name as TextFieldNames].placeholder}
        type={TEXT_FIELD_TYPE[name as TextFieldNames]}
        value={value}
      />
    );
  }

  /**
   * Returns translated error message based on occurred error reason.
   */
  @computed
  private get error() {
    const { name, reason } = this.props;

    return reason === undefined
      ? undefined
      : this.translation[name].reasons[reason];
  }

  /**
   * Returns an array of options for `Select` component based on predefined
   * option values defined in `SELECT_OPTION_VALUES`.
   */
  @computed
  private get options() {
    const values: string[] =
      SELECT_OPTION_VALUES[this.props.name as SelectNames];

    return values.map(value => ({
      label: (this.translation[this.props.name as SelectNames].options as {
        [key: string]: string;
      })[value],
      value
    }));
  }
}
