import {
  ErrorReasons,
  NutritionDeclaration as ApiNutritionDeclaration,
  Units
} from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene, DefaultSceneProps } from "./Scene";
import { Button } from "../component/Button";
import {
  Nutrients,
  NutritionDeclaration,
  NutritionDeclarationErrorReasons,
  NutritionDeclarationValue
} from "../component/NutritionDeclaration";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { Controls, Form, Group } from "../component/collection/form";
import { SceneContext } from "./SceneContext";
import { any, insert } from "../utility/form";

/**
 * Array of text field input names.
 */
const TEXT_FIELDS = ["name", "barcode", "quantity"] as const;

/**
 * Union of all text field input names.
 */
type TextFieldNames = typeof TEXT_FIELDS[number];

/**
 * Union of all input names.
 */
type InputNames = TextFieldNames | "unit";

/**
 * Type of an object that maps input name to occurred error reason.
 */
type InputErrorReasons = Partial<Record<InputNames, ErrorReasons>>;

/**
 * Result of converting nutrition declaration component value to API nutrition
 * declaration object.
 */
type ParseResult =
  | { ok: true; value: ApiNutritionDeclaration }
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
      : UnitSelectTranslation
  };

  /**
   * Form submit button text.
   */
  submit: string;
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
    barcode: "",
    quantity: "",
    unit: undefined as Units | undefined,
    nutritionDeclaration: {
      energy: "",
      fat: "",
      carbohydrate: "",
      protein: ""
    } as NutritionDeclarationValue
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

          <NutritionDeclaration
            name="nutritionDeclaration"
            onChange={this.handleDeclarationChange}
            reasons={this.reasons.nutritionDeclaration}
            value={this.values.nutritionDeclaration}
          />
        </Group>
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
  private renderTextField = (name: TextFieldNames) => {
    return (
      <TextField
        errorMessage={this.messageFor(name)}
        invalid={this.reasons[name] !== undefined}
        label={this.translation.inputs[name].label}
        name={name}
        onChange={this.handleTextFieldChange}
        required={name !== "barcode"}
        type={name === "barcode" ? "tel" : name === "name" ? "text" : "number"}
        value={this.values[name]}
      />
    );
  };

  /**
   * Updates text field value on input value change.
   */
  @action
  private handleTextFieldChange = (name: TextFieldNames, value: string) => {
    this.values[name] = value;
  };

  /**
   * Updates unit value on unit selection change.
   */
  @action
  private handleUnitChange = (name: "unit", value: Units | undefined) => {
    this.values[name] = value;
  };

  /**
   * Updates product nutrition declaration value on change.
   */
  @action
  private handleDeclarationChange = (
    name: "nutritionDeclaration",
    value: NutritionDeclarationValue
  ) => {
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
      nutritionDeclaration: declaration
    } = this.values;

    const result = this.parse(declaration);

    // Client side validation error reasons for each input.
    const reasons: FoodEditErrorReasons = {
      name: name.trim() === "" ? "empty" : undefined,
      quantity:
        quantity.trim() === ""
          ? "empty"
          : Number.isNaN(Number.parseFloat(quantity))
          ? "invalid"
          : undefined,
      unit: unit === undefined ? "missing" : undefined,
      nutritionDeclaration: result.ok ? undefined : result.value
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
            result.value as ApiNutritionDeclaration
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
   * Converts `NutritionDeclarationValue` type object to API nutrition
   * declaration object and returns either `ApiNutritionDeclaration` type object
   * or object that maps nutrient names to occurred error reasons.
   */
  private parse = (declaration: NutritionDeclarationValue): ParseResult => {
    const reasons: NutritionDeclarationErrorReasons = {};
    const result: Partial<ApiNutritionDeclaration> = {};

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
      return { ok: true, value: result as ApiNutritionDeclaration };
    }
  };
}
