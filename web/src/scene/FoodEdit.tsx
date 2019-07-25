import { ErrorReasons, NutritionDeclarationData, Units } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene, DefaultSceneProps } from "./Scene";
import { Button } from "../component/Button";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { Controls, Form, Group } from "../component/collection/form";
import { SceneContext } from "./SceneContext";
import { any, insert } from "../utility/form";

/**
 * Union of text field input names.
 */
type TextFieldNames = "name" | "barcode" | "quantity" | "pieceQuantity";

/**
 * Union of all input names.
 */
type InputNames = TextFieldNames | "unit";

/**
 * Type of an object that maps input name to occurred error reason.
 */
type InputErrorReasons = Partial<Record<InputNames, ErrorReasons>>;

/**
 * Array of nutrients nutrition declaration contains.
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
 * Union of all nutrient names.
 */
export type Nutrients = typeof NUTRIENTS[number];

/**
 * Array of required nutrients, other nutrient text fields will be optional.
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
 * Result of converting nutrition declaration component value to API nutrition
 * declaration object.
 */
type ParseResult =
  | { ok: true; value: NutritionDeclarationData }
  | { ok: false; value: NutritionDeclarationErrorReasons };

/**
 * Text field input translation.
 */
interface TextFieldTranslation {
  /**
   * Text field label text.
   */
  label: string;

  /**
   * Error messages of various error reasons input may have.
   */
  reasons: Partial<Record<ErrorReasons, string>>;
}

/**
 * Unit selection component translation.
 */
interface UnitSelectTranslation extends TextFieldTranslation {
  /**
   * Translations of unit options.
   */
  options: Record<Units, string>;
}

/**
 * Food edit scene translation.
 */
interface FoodEditTranslation {
  /**
   * Registration form input translations.
   */
  inputs: {
    [InputName in InputNames]: InputName extends TextFieldNames
      ? TextFieldTranslation
      : UnitSelectTranslation;
  };

  /**
   * Nutrient name translations.
   */
  nutrients: Record<Nutrients, string>;

  /**
   * Form submit button text.
   */
  submit: string;

  /**
   * Unit translations.
   */
  units: Record<"g" | "kcal", string>;
}

/**
 * Object type that maps food edit input names to occurred error reasons.
 */
type FoodEditErrorReasons = InputErrorReasons & {
  nutritionDeclaration?: NutritionDeclarationErrorReasons;
};

/**
 * Food editing scene that allows user to either create new or edit existing
 * food product.
 */
@inject("foods", "views")
@observer
export class FoodEdit extends Scene<"FoodEdit", {}, FoodEditTranslation> {
  /**
   * Form field values.
   */
  @observable private values = {
    name: "",
    barcode: undefined as string | undefined,
    quantity: "",
    unit: undefined as Units | undefined,
    nutritionDeclaration: {
      energy: "",
      fat: "",
      carbohydrate: "",
      protein: ""
    } as NutritionDeclarationValue,
    pieceQuantity: undefined as string | undefined
  };

  /**
   * Object that contains error reasons of occurred errors of each input and
   * error reasons for each declaration nutrients.
   */
  @observable private reasons: FoodEditErrorReasons = {};

  /**
   * Creates `FoodEdit` scene instance and shows the same scene on the side if
   * scene is rendered as the main scene.
   */
  public constructor(props: DefaultSceneProps<"FoodEdit">) {
    super(props);

    if (props.position === "main") {
      this.props.views!.aside(new SceneContext("FoodEdit", undefined, {}));
    }
  }

  /**
   * Renders food creation and editing form.
   */
  public render() {
    if (this.props.position === "main") {
      return null;
    }

    return (
      <Form noValidate={true} onSubmit={this.handleSubmit}>
        <Group>
          {this.renderTextField("name")}
          {this.renderTextField("barcode")}
        </Group>

        <Group>
          {this.renderTextField("quantity")}

          <Select
            errorMessage={this.messageFor("unit")}
            invalid={this.reasons.unit !== undefined}
            label={this.translation.inputs.unit.label}
            name="unit"
            onChange={this.handleUnitChange}
            options={[
              { label: this.translation.inputs.unit.options.g, value: "g" },
              { label: this.translation.inputs.unit.options.ml, value: "ml" }
            ]}
            value={this.values.unit}
          />
        </Group>

        <Group>{NUTRIENTS.map(this.renderNutrientTextField)}</Group>

        {this.renderTextField("pieceQuantity")}

        <Controls>
          <Button invalid={any(this.reasons)}>{this.translation.submit}</Button>
        </Controls>
      </Form>
    );
  }

  /**
   * Renders text field with name `name`.
   *
   * @param name Text field name which will be rendered.
   */
  private renderTextField = (name: TextFieldNames) => (
    <TextField
      errorMessage={this.messageFor(name)}
      invalid={this.reasons[name] !== undefined}
      label={this.translation.inputs[name].label}
      name={name}
      onChange={this.handleTextFieldChange}
      optional={name === "barcode" || name === "pieceQuantity"}
      required={name === "barcode" || name === "pieceQuantity"}
      textAlign={name === "pieceQuantity" ? "right" : "left"}
      type={name === "barcode" ? "tel" : name === "name" ? "text" : "number"}
      unit={
        name === "pieceQuantity" && this.values.unit !== undefined
          ? this.translation.inputs.unit.options[this.values.unit!]
          : undefined
      }
      value={this.values[name]}
    />
  );

  /**
   * Renders nutrient amount text field.
   */
  public renderNutrientTextField = (nutrient: Nutrients) => (
    <TextField
      key={nutrient}
      invalid={
        this.reasons.nutritionDeclaration &&
        this.reasons.nutritionDeclaration[nutrient] !== undefined
      }
      label={this.translation.nutrients[nutrient]}
      name={nutrient}
      onChange={this.handleNutrientChange}
      optional={!(REQUIRED_NUTRIENTS as readonly string[]).includes(nutrient)}
      textAlign="right"
      type="number"
      unit={this.translation.units[nutrient === "energy" ? "kcal" : "g"]}
      value={this.values.nutritionDeclaration[nutrient]}
    />
  );

  /**
   * Updates text field value on input value change.
   */
  @action
  private handleTextFieldChange = (name: TextFieldNames, value: string) => {
    this.values[name] = value;
  };

  /**
   * Updates nutrient amount on nutrient input value change.
   */
  @action
  private handleNutrientChange = (nutrient: Nutrients, amount: string) => {
    this.values.nutritionDeclaration[nutrient] = amount;
  };

  /**
   * Updates unit value on unit selection change.
   */
  @action
  private handleUnitChange = (name: "unit", value: Units | undefined) => {
    this.values[name] = value;
  };

  /**
   * Prevents default form submit event and executes food item saving procedure
   * instead.
   */
  @action
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    const {
      name,
      barcode,
      quantity,
      unit,
      nutritionDeclaration,
      pieceQuantity
    } = this.values;

    const result = this.parse(nutritionDeclaration);

    // Client side validation error reasons for each input.
    const reasons: FoodEditErrorReasons = {
      name: name.trim() === "" ? "empty" : undefined,
      barcode:
        barcode !== undefined && barcode.trim() === "" ? "empty" : undefined,
      quantity:
        quantity.trim() === ""
          ? "empty"
          : Number.isNaN(Number.parseFloat(quantity))
          ? "invalid"
          : undefined,
      unit: unit === undefined ? "missing" : undefined,
      nutritionDeclaration: result.ok ? undefined : result.value,
      pieceQuantity:
        pieceQuantity !== undefined && pieceQuantity.trim() === ""
          ? "empty"
          : pieceQuantity !== undefined &&
            Number.isNaN(Number.parseFloat(pieceQuantity))
          ? "invalid"
          : undefined
    };

    const skip = any(reasons);

    const error = await this.props.views!.load(
      skip
        ? undefined
        : this.props.foods!.save(
            undefined,
            name,
            barcode,
            unit!,
            result.value as NutritionDeclarationData,
            pieceQuantity === undefined
              ? pieceQuantity
              : Number.parseFloat(pieceQuantity)
          )
    );

    this.reasons = insert(reasons, error);
  };

  /**
   * Returns an error message for input named `name`.
   *
   * @param name Input name.
   */
  private messageFor = (name: InputNames) => {
    return this.reasons[name] !== undefined
      ? this.translation.inputs[name].reasons[this.reasons[name]!]
      : undefined;
  };

  /**
   * Converts `NutritionDeclarationValue` type object to
   * `NutritionDeclarationData` and and returns `ParseResult`.
   *
   * If `ParseResult` `ok` field is `true`, result value will be
   * `NutritionDeclarationData` type object, otherwise
   * `NutritionDeclarationErrorReasons` type.
   */
  private parse = (declaration: NutritionDeclarationValue): ParseResult => {
    const reasons: NutritionDeclarationErrorReasons = {};
    const result: Partial<NutritionDeclarationData> = {};

    for (const nutrient of Object.keys(declaration) as Nutrients[]) {
      const value = declaration[nutrient];

      if (value === undefined) {
        continue;
      }

      const numericValue = Number.parseFloat(value);

      if (Number.isNaN(numericValue)) {
        reasons[nutrient] = "invalid";
      } else {
        result[nutrient] = numericValue;
      }
    }

    if (any(reasons)) {
      return { ok: false, value: reasons };
    } else {
      return { ok: true, value: result as NutritionDeclarationData };
    }
  };
}
