import { ErrorReasons } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { CheckBox } from "./CheckBox";
import { TextField } from "./TextField";
import { Field, Label } from "./collection/input";
import { styled } from "../styling/theme";

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
 * Returns an object that maps nutrient name to whether or not its text field is disabled.
 */
const getDisabled = (
  value: NutritionDeclarationValue
): Record<Nutrients, boolean> => {
  const disabled: Partial<Record<Nutrients, boolean>> = {};

  for (const nutrient of NUTRIENTS) {
    disabled[nutrient] =
      !(REQUIRED_NUTRIENTS as readonly string[]).includes(nutrient) &&
      value[nutrient] === undefined;
  }

  return disabled as Record<Nutrients, boolean>;
};

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
   * Object that maps nutrient name to whether or not its text field is
   * disabled.
   */
  @observable private disabled = getDisabled(this.props.value);

  /**
   * Nutrient name of currently focused text field.
   */
  @observable private focusedNutrient?: Nutrients;

  /**
   * Renders text fields for each nutrient.
   */
  public render() {
    return <Table>{NUTRIENTS.map(this.renderNutrientTextField)}</Table>;
  }

  /**
   * Renders a check box (if not required nutrient), label, text field and unit
   * component of a single nutrient.
   */
  public renderNutrientTextField = (nutrient: Nutrients) => {
    const disabled = this.disabled[nutrient];
    const focused = this.focusedNutrient === nutrient;
    const invalid =
      this.props.reasons && this.props.reasons[nutrient] !== undefined;
    const required = (REQUIRED_NUTRIENTS as readonly string[]).includes(
      nutrient
    );
    const value = this.props.value[nutrient] || "";

    return (
      <Field
        key={nutrient}
        active={focused}
        disabled={disabled}
        invalid={invalid}
        underline={true}
      >
        {!required && (
          <CheckBox
            basic={true}
            invalid={invalid}
            name={nutrient}
            onChange={this.handleCheck}
            onFocusChange={this.handleFocusChange}
            value={!disabled}
          />
        )}
        <Entry>
          <Label
            active={focused}
            invalid={invalid}
            title={this.translation.nutrients[nutrient]}
          >
            {this.translation.nutrients[nutrient]}
          </Label>
          <TextField
            basic={true}
            disabled={disabled}
            invalid={invalid}
            name={nutrient}
            onChange={this.handleChange}
            onFocusChange={this.handleFocusChange}
            textAlign="right"
            type="number"
            value={value}
          />
          <Unit active={focused} invalid={invalid}>
            {this.translation.units[nutrient === "energy" ? "kcal" : "g"]}
          </Unit>
        </Entry>
      </Field>
    );
  };

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

  /**
   * Updates nutrient disabled state on check box checked state change and
   * resets nutrient amount value.
   */
  @action
  private handleCheck = (nutrient: Nutrients, check: boolean) => {
    const { name, onChange, value } = this.props;

    this.disabled[nutrient] = !check;

    if (onChange === undefined) {
      return;
    }

    onChange(name, { ...value, [nutrient]: check ? "" : undefined });
  };

  /**
   * Updates currently focused nutrient on nutrient text field focus change.
   */
  @action
  private handleFocusChange = (nutrient: Nutrients, focus: boolean) => {
    this.focusedNutrient = focus ? nutrient : undefined;
  };
}

/**
 * Component that contains all nutrient amount inputs.
 */
const Table = styled.div`
  border: solid 1px ${({ theme }) => theme.BORDER_COLOR};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS};
`;

/**
 * Entry component that contains label, input and unit components.
 *
 * This component is an <label> element, meaning that clicking on any of the
 * child components input will be focused thus increasing clickable area for the
 * input.
 */
const Entry = styled.label`
  min-width: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;

  cursor: text;
`;

/**
 * Component that contains nutrient amount unit.
 */
const Unit = styled(Label)`
  min-width: initial;
  width: ${({ theme }) => theme.HEIGHT};

  display: flex;
  flex: 0 0 auto;
  justify-content: center;
`;
