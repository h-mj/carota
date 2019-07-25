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
import { any, ErrorReasonsFor, insert } from "../utility/form";

/**
 * Union of text field input names.
 */
type TextFieldNames = "name" | "barcode" | "quantity" | "pieceQuantity";

/**
 * Union of non nutrient input names.
 */
type InputNames = TextFieldNames | "unit";

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
type Nutrients = typeof NUTRIENTS[number];

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
 * Input translation.
 */
interface InputTranslation {
  /**
   * Input label text.
   */
  label: string;

  /**
   * Error messages of various error reasons input may have.
   */
  reasons: Partial<Record<ErrorReasons, string>>;
}

/**
 * Food edit scene translation.
 */
interface EditTranslation {
  /**
   * Registration form input translations.
   */
  inputs: {
    [InputName in InputNames]: InputTranslation;
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
  units: Record<"g" | "kcal" | "ml", string>;
}

/**
 * Food editing form values object type.
 */
interface EditValues {
  name: string;
  barcode?: string;
  quantity: string;
  unit?: Units;
  nutritionDeclaration: NutritionDeclarationValues;
  pieceQuantity?: string;
}

/**
 * Nutrient amount values.
 */
type NutritionDeclarationValues = Record<RequiredNutrients, string> &
  Partial<Record<Exclude<Nutrients, RequiredNutrients>, string>>;

/**
 * Result of converting nutrition declaration component value to API nutrition
 * declaration object.
 */
type ParseResult =
  | { ok: true; value: NutritionDeclarationData }
  | { ok: false; value: ErrorReasonsFor<NutritionDeclarationValues> };

/**
 * Food editing scene that allows user to either create new or edit existing
 * food product.
 */
@inject("foods", "views")
@observer
export class Edit extends Scene<"Edit", {}, EditTranslation> {
  /**
   * Food editing form field values.
   */
  @observable private values: EditValues = {
    name: "",
    quantity: "",
    nutritionDeclaration: {
      energy: "",
      fat: "",
      carbohydrate: "",
      protein: ""
    } as NutritionDeclarationValues
  };

  /**
   * Object that contains error reasons of occurred errors for each value.
   */
  @observable private reasons: ErrorReasonsFor<EditValues> = {};

  /**
   * Creates `Edit` scene instance and shows the same scene on the side if
   * scene is rendered as the main scene.
   */
  public constructor(props: DefaultSceneProps<"Edit">) {
    super(props);

    if (props.position === "main") {
      this.props.views!.aside(new SceneContext("Edit", undefined, {}));
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
              { label: this.translation.units.g, value: "g" },
              { label: this.translation.units.ml, value: "ml" }
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
          ? this.translation.units[this.values.unit!]
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
    const reasons: ErrorReasonsFor<EditValues> = {
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
   * Returns an error message for non nutrient input named `name`.
   *
   * @param name Input name.
   */
  private messageFor = (name: InputNames) => {
    const reason = this.reasons[name];

    return reason !== undefined
      ? this.translation.inputs[name].reasons[reason]
      : undefined;
  };

  /**
   * Converts `NutritionDeclarationValues` type object to
   * `NutritionDeclarationData` and and returns `ParseResult`.
   *
   * If `ParseResult` `ok` field is `true`, result value will be
   * `NutritionDeclarationData` type object, otherwise
   * `ErrorReasonsFor<NutritionDeclarationValue>` type.
   */
  private parse = (declaration: NutritionDeclarationValues): ParseResult => {
    const data: Partial<NutritionDeclarationData> = {};
    const reasons: ErrorReasonsFor<NutritionDeclarationValues> = {};

    for (const nutrient of Object.keys(declaration) as Nutrients[]) {
      const value = declaration[nutrient];

      if (value === undefined) {
        continue;
      }

      const numericValue = Number.parseFloat(value);

      if (Number.isNaN(numericValue)) {
        reasons[nutrient] = "invalid";
      } else {
        data[nutrient] = numericValue;
      }
    }

    if (any(reasons)) {
      return { ok: false, value: reasons };
    } else {
      return { ok: true, value: data as NutritionDeclarationData };
    }
  };
}
