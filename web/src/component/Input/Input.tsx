import { ErrorReasons } from "api";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "../Component";
import { DeclareNutrition, DeclareNutritionProps } from "./DeclareNutrition";
import { Select } from "../Select";
import { TextField } from "../TextField";

/**
 * Input definitions object.
 */
const INPUTS = {
  barcode: { component: "TextField", type: "tel" },
  name: { component: "TextField", type: "text" },
  nutritionDeclaration: { component: "DeclareNutrition" },
  unit: { component: "Select", options: ["g", "ml"] }
} as const;

/**
 * Union of all component names.
 */
export type ComponentNames = typeof INPUTS[keyof typeof INPUTS]["component"];

/**
 * Union of input names that use given component.
 */
export type InputNames<
  TComponentName extends ComponentNames = ComponentNames
> = {
  [InputName in keyof typeof INPUTS]: typeof INPUTS[InputName]["component"] extends TComponentName
    ? InputName
    : never
}[keyof typeof INPUTS];

/**
 * Union of input value types of given input names.
 */
export type InputValues<TInputNames extends InputNames = InputNames> = {
  [InputName in TInputNames]: InputName extends InputNames<"DeclareNutrition">
    ? DeclareNutritionProps["value"]
    : InputName extends InputNames<"Select">
    ? SelectOptionValues<InputName> | undefined
    : InputName extends InputNames<"TextField">
    ? string
    : never
}[TInputNames];

/**
 * Returns default value of input named `inputName`.
 */
export const getDefaultValue = <TInputName extends InputNames>(
  inputName: TInputName
) => {
  const { component } = INPUTS[inputName];

  if (component === "DeclareNutrition") {
    return DeclareNutrition.getDefaultValue();
  } else if (component === "Select") {
    return undefined;
  } else if (component === "TextField") {
    return "";
  } else {
    throw new Error(`Unknown component ${component}.`);
  }
};

/**
 * Union of error reason types of given input names.
 */
export type InputErrorReasons<TInputNames extends InputNames = InputNames> = {
  [InputName in TInputNames]: InputName extends InputNames<"DeclareNutrition">
    ? DeclareNutritionProps["reason"]
    : ErrorReasons
}[TInputNames];

/**
 * Union of option values of select inputs named `TSelectNames`.
 */
export type SelectOptionValues<
  TSelectNames extends InputNames<"Select">
> = typeof INPUTS[TSelectNames]["options"] extends readonly (infer IOptions)[]
  ? IOptions extends string
    ? IOptions
    : never
  : never;

/**
 * Change handler function type of given input names.
 */
export type InputChangeHandler<TName extends string, TValues> = (
  name: TName,
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
   * Name of input component.
   */
  name: TInputNames;

  /**
   * Function that will be called when input value changes.
   */
  onChange?: InputChangeHandler<TInputNames, InputValues<TInputNames>>;

  /**
   * Input value.
   */
  value: InputValues<TInputNames>;

  /**
   * Reason why an error related to this input occurred.
   */
  reason?: InputErrorReasons<TInputNames>;
}

/**
 * Input component translation.
 */
type InputsTranslation = {
  [InputName in InputNames]: InputName extends InputNames<"Select">
    ? SelectTranslation<InputName>
    : InputTranslation
};

/**
 * General input component translation.
 */
interface InputTranslation {
  label: string;
  reasons: Partial<Record<ErrorReasons, string>>;
}

/**
 * Select input translation.
 */
interface SelectTranslation<SelectName extends InputNames<"Select">>
  extends InputTranslation {
  options: Record<SelectOptionValues<SelectName>, string>;
}

/**
 * Component that renders either `Select` or `TextField` component with
 * translated placeholder and error texts or translated label and error texts
 * alongside predefined and translated options respectively.
 */
@inject("views")
@observer
export class Input<
  TInputNames extends InputNames = InputNames
> extends Component<InputProps<TInputNames>, InputsTranslation> {
  /**
   * Renders component that corresponds to `name` prop.
   */
  public render() {
    const { component } = INPUTS[this.props.name];

    if (component === "DeclareNutrition") {
      return this.renderDeclareNutrition();
    } else if (component === "Select") {
      return this.renderSelect();
    } else if (component === "TextField") {
      return this.renderTextField();
    } else {
      throw new Error(`Unknown component ${component}.`);
    }
  }

  /**
   * Renders a `DeclareNutrition` component.
   */
  private renderDeclareNutrition() {
    const { autoFocus, name, onChange, reason, value } = this
      .props as InputProps<InputNames<"DeclareNutrition">>;

    return (
      <DeclareNutrition
        autoFocus={autoFocus}
        label={this.translation[name].label}
        name={name}
        onChange={onChange}
        value={value}
        reason={reason}
      />
    );
  }

  /**
   * Renders a `Select` component.
   */
  private renderSelect() {
    const { name, onChange, reason, value } = this.props as InputProps<
      InputNames<"Select">
    >;

    return (
      <Select
        errorMessage={this.errorMessage}
        invalid={reason !== undefined}
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
    const { autoFocus, name, onChange, reason, value } = this
      .props as InputProps<InputNames<"TextField">>;

    return (
      <TextField
        autoFocus={autoFocus}
        errorMessage={this.errorMessage}
        invalid={reason !== undefined}
        label={this.translation[name].label}
        name={name}
        onChange={onChange}
        type={INPUTS[name].type}
        value={value || ""}
      />
    );
  }

  private get errorMessage() {
    const { name, reason } = this.props as InputProps<
      InputNames<"Select" | "TextField">
    >;

    if (reason === undefined) {
      return undefined;
    }

    return this.translation[name].reasons[reason];
  }

  /**
   * Returns an array of options for `Select` component based on predefined
   * option values defined in `SELECT_OPTION_VALUES`.
   */
  @computed
  private get options() {
    const { name } = this.props as InputProps<InputNames<"Select">>;

    return (INPUTS[name].options as readonly SelectOptionValues<
      InputNames<"Select">
    >[]).map(value => ({
      label: (this.translation[name] as any).options[value],
      value
    }));
  }
}
