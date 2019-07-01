import { ErrorReasons, Languages, Units } from "api";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { TextField, TextFieldProps, TextFieldType } from "./TextField";
import { Select, SelectProps } from "./Select";
import { DeclareNutrition, DeclareNutritionProps } from "./DeclareNutrition";

/**
 * Union of all component names.
 */
export type InputNames = DeclareNutritionNames | SelectNames | TextFieldNames;

/**
 * Union of input value types of given input names.
 */
export type InputValues<TInputNames extends InputNames = InputNames> = {
  [InputName in TInputNames]: InputName extends DeclareNutritionNames
    ? DeclareNutritionProps["value"]
    : InputName extends SelectNames
    ? SelectProps<SelectOptions[InputName]>["value"]
    : InputName extends TextFieldNames
    ? TextFieldProps["value"]
    : never
}[TInputNames];

/**
 * Declare nutrition component name.
 */
export type DeclareNutritionNames = "declareNutrition";

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
export type SelectNames = keyof SelectOptions;

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
export type TextFieldNames = "barcode" | "email" | "name" | "password";

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
 * Change handler function type of given input names.
 */
export type InputChangeHandler<TValues> = (
  name: string,
  value: TValues
) => void;

/**
 * Input component props.
 */
interface InputProps<TInputNames extends InputNames = InputNames> {
  /**
   * Whether or not this input should be in the focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Name of either `Select` or `TextField` component.
   */
  name: TInputNames;

  /**
   * Function that will be called when input value changes.
   */
  onChange?: InputChangeHandler<InputValues<TInputNames>>;

  /**
   * Input value.
   */
  value?: InputValues<TInputNames>;

  /**
   * Reason why an error related to this input occurred.
   */
  reason?: ErrorReasons;
}

/**
 * Input component translation.
 */
type InputsTranslation = {
  [InputName in SelectNames | TextFieldNames]: InputName extends SelectNames
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
export class Input<
  TInputNames extends InputNames = InputNames
> extends Component<InputProps<TInputNames>, InputsTranslation> {
  /**
   * Renders component that corresponds to `name` prop.
   */
  public render() {
    const { name } = this.props;

    if (name === "declareNutrition") {
      return this.renderDeclareNutrition();
    } else if (name in SELECT_OPTION_VALUES) {
      return this.renderSelect();
    } else {
      return this.renderTextField();
    }
  }

  /**
   * Renders a `DeclareNutrition` component.
   */
  private renderDeclareNutrition() {
    const { autoFocus, name, onChange, value } = this.props as InputProps<
      DeclareNutritionNames
    >;

    return (
      <DeclareNutrition
        autoFocus={autoFocus}
        name={name}
        onChange={onChange}
        value={value}
      />
    );
  }

  /**
   * Renders a `Select` component.
   */
  private renderSelect() {
    const { name, onChange, value } = this.props as InputProps<SelectNames>;

    return (
      <Select
        error={this.error}
        label={this.translation[name].label}
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
    const { autoFocus, name, onChange, value } = this.props as InputProps<
      TextFieldNames
    >;

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
      : this.translation[name as SelectNames | TextFieldNames].reasons[reason];
  }

  /**
   * Returns an array of options for `Select` component based on predefined
   * option values defined in `SELECT_OPTION_VALUES`.
   */
  @computed
  private get options() {
    const { name } = this.props as InputProps<SelectNames>;

    return (SELECT_OPTION_VALUES[name] as string[]).map(value => ({
      label: (this.translation[name].options as any)[value],
      value
    }));
  }
}
