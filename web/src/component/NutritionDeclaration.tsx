import { ErrorReasons } from "api";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { TextField } from "./TextField";
import { Group } from "./collection/form";

/**
 * Array of nutrients where each nutrient will have corresponding text field
 * within `NutritionDeclaration` component.
 */
const NUTRIENTS = [
  "energy",
  "fat",
  "saturates",
  "monoUnsaturates",
  "polyunsaturates",
  "carbohydrate",
  "sugars",
  "polyols",
  "starch",
  "fibre",
  "protein",
  "salt"
] as const;

/**
 * Union of all nutrients.
 */
export type Nutrients = typeof NUTRIENTS[number];

/**
 * Array of required nutrients, other nutrient amount values are not required
 * and can be `undefined`.
 */
const REQUIRED_NUTRIENTS = [
  "energy",
  "fat",
  "carbohydrate",
  "protein"
] as const;

/**
 * Union of all required nutrients.
 */
type RequiredNutrients = typeof REQUIRED_NUTRIENTS[number];

/**
 * Nutrient amount values.
 */
export type NutritionDeclarationValue = Record<RequiredNutrients, string> &
  Partial<Record<Exclude<Nutrients, RequiredNutrients>, string>>;

/**
 * Object type that maps nutrient name to occurred error reason.
 */
export type NutritionDeclarationErrorReasons = Partial<
  Record<Nutrients, ErrorReasons>
>;

/**
 * Nutrition declaration component props.
 */
interface NutritionDeclarationProps<TName extends string> {
  /**
   * Whether or not first nutrient field should be in focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Whether or not nutrition declaration is disabled.
   */
  disabled?: boolean;

  /**
   * Name of the nutrition declaration that will be included in parameters of
   * `onChange` callback function.
   */
  name: TName;

  /**
   * Function that will be called when one of the nutrient values changes.
   */
  onChange?: (name: TName, value: NutritionDeclarationValue) => void;

  /**
   * Whether or not nutrition declaration is read only.
   */
  readOnly?: boolean;

  /**
   * Object that maps nutrient names to error reasons, used to check whether or
   * not some nutrient value is invalid.
   */
  reasons?: NutritionDeclarationErrorReasons;

  /**
   * Whether or not use underline style.
   */
  underline?: boolean;

  /**
   * Nutrient amount values.
   */
  value: NutritionDeclarationValue;
}

/**
 * Nutrition declaration component translation.
 */
interface NutritionDeclarationTranslation {
  /**
   * Nutrient name translations.
   */
  nutrients: Record<Nutrients, string>;

  /**
   * Title text.
   */
  title: string;

  /**
   * Amount unit translations.
   */
  units: Record<"g" | "kcal", string>;
}

/**
 * Component that is used to declare nutritional information of some product.
 */
@inject("views")
@observer
export class NutritionDeclaration<
  TName extends string = string
> extends Component<
  NutritionDeclarationProps<TName>,
  NutritionDeclarationTranslation
> {
  /**
   * Renders text fields for each nutrient.
   */
  public render() {
    return <Group>{NUTRIENTS.map(this.renderNutrientTextField)}</Group>;
  }

  /**
   * Renders a check box (if not required nutrient), label, text field and unit
   * component of a single nutrient.
   */
  public renderNutrientTextField = (nutrient: Nutrients) => (
    <TextField
      invalid={this.props.reasons && this.props.reasons[nutrient] !== undefined}
      label={this.translation.nutrients[nutrient]}
      name={nutrient}
      onChange={this.handleChange}
      optional={!(REQUIRED_NUTRIENTS as readonly string[]).includes(nutrient)}
      textAlign="right"
      type="number"
      unit={this.translation.units[nutrient === "energy" ? "kcal" : "g"]}
      value={this.props.value[nutrient]}
    />
  );

  /**
   * Calls `onChange` callback function prop on one nutrient amount change.
   */
  private handleChange = (nutrient: Nutrients, amount: string) => {
    const { name, onChange, value } = this.props;

    if (onChange === undefined) {
      return;
    }

    onChange(name, { ...value, [nutrient]: amount });
  };
}
