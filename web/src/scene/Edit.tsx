import {
  ErrorReasons,
  FoodSaveBody,
  NutritionDeclarationData,
  Units
} from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DefaultSceneProps, Scene } from "./Scene";
import { Button } from "../component/Button";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { Controls, Form, Group } from "../component/collection/form";
import { Food } from "../model/Food";
import { any, append, ErrorReasonsFor } from "../utility/form";
import { from } from "../utility/shift";

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
 * Edit scene props.
 */
interface EditProps {
  /**
   * Food item model that is being edited.
   */
  food?: Food;
}

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
  inputs: { [InputName in InputNames]: InputTranslation };

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
 * Nutrient amount values.
 */
type NutritionDeclarationValues = Record<RequiredNutrients, string> &
  Partial<Record<Exclude<Nutrients, RequiredNutrients>, string>>;

/**
 * Food editing form values object type.
 */
interface EditValues {
  id?: string;
  name: string;
  barcode?: string;
  quantity: string;
  unit?: Units;
  nutritionDeclaration: NutritionDeclarationValues;
  pieceQuantity?: string;
}

/**
 * Blueprint using which `NutritionDeclarationValues` type object is transformed
 * into `NutritionDeclarationData` object.
 */
// prettier-ignore
const NUTRITION_DECLARATION_BLUEPRINT = {
  energy: from<string>().parseFloat().build(),
  fat: from<string>().parseFloat().build(),
  saturates: from<string | undefined>().optional().parseFloat().build(),
  monoUnsaturates: from<string | undefined>().optional().parseFloat().build(),
  polyunsaturates: from<string | undefined>().optional().parseFloat().build(),
  carbohydrate: from<string>().parseFloat().build(),
  sugars: from<string | undefined>().optional().parseFloat().build(),
  polyols: from<string | undefined>().optional().parseFloat().build(),
  starch: from<string | undefined>().optional().parseFloat().build(),
  fibre: from<string | undefined>().optional().parseFloat().build(),
  protein: from<string>().parseFloat().build(),
  salt: from<string | undefined>().optional().parseFloat().build()
};

/**
 * Blueprint using which `EditValues` type object is transformed into
 * `FoodSaveBody` object.
 */
// prettier-ignore
const FOOD_BLUEPRINT = {
  id: from<string | undefined>().build(),
  name: from<string>().notEmpty().build(),
  barcode: from<string | undefined>().optional().notEmpty().build(),
  quantity: from<string>().notEmpty().parseFloat().set(undefined).build(),
  unit: from<Units | undefined>().string().build(),
  nutritionDeclaration: from<NutritionDeclarationValues>()
    .construct<NutritionDeclarationData, typeof NUTRITION_DECLARATION_BLUEPRINT>(
      NUTRITION_DECLARATION_BLUEPRINT
    )
    .build(),
  pieceQuantity: from<string | undefined>().optional().notEmpty().parseFloat().build()
};

/**
 * Function that transforms `EditValues` type object into `FoodSaveBody` type
 * object.
 */
// prettier-ignore
const FOOD_TRANSFORMATION = from<EditValues>().construct<FoodSaveBody, typeof FOOD_BLUEPRINT>(FOOD_BLUEPRINT).build();

/**
 * Food editing scene that allows user to either create new or edit existing
 * food product.
 */
@inject("foods", "views")
@observer
export class Edit extends Scene<"Edit", EditProps, EditTranslation> {
  /**
   * Food editing form field values.
   */
  @observable private values: EditValues = this.getValues();

  /**
   * Object that contains error reasons of occurred errors for each value.
   */
  @observable private reasons: ErrorReasonsFor<EditValues> = {};

  /**
   * Sets the name of this scene.
   */
  public constructor(props: EditProps & DefaultSceneProps<"Edit">) {
    super("Edit", props);
  }

  /**
   * Renders food creation and editing form.
   */
  public render() {
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
      textAlign="right"
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

    const result = FOOD_TRANSFORMATION(this.values);

    if (result.kind === "Ok") {
      // Normalize all nutrient values per unit.
      const { quantity } = this.values;
      const { nutritionDeclaration } = result.value;

      for (const nutrient of NUTRIENTS) {
        const value = nutritionDeclaration[nutrient];

        if (value !== undefined) {
          nutritionDeclaration[nutrient] = value / Number.parseFloat(quantity);
        }
      }
    }

    const error = await this.props.views!.load(
      result.kind === "Ok" ? this.props.foods!.save(result.value) : undefined
    );

    if (result.kind === "Ok" && error === undefined) {
      this.props.views!.refocus();
    }

    this.reasons = append(result.kind === "Err" ? result.value : {}, error);
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
   * Returns form values object based on`food` prop model based on default
   * values.
   */
  private getValues(): EditValues {
    const { food } = this.props;

    return {
      id: food !== undefined ? food.id : undefined,
      name: food !== undefined ? food.name : "",
      barcode: food !== undefined ? food.barcode : undefined,
      quantity: food !== undefined ? "100" : "",
      unit: food !== undefined ? food.unit : undefined,
      nutritionDeclaration: Object.assign(
        {},
        ...NUTRIENTS.map(nutrient => ({
          [nutrient]:
            food !== undefined &&
            food.nutritionDeclaration[nutrient] !== undefined
              ? (100 * food.nutritionDeclaration[nutrient]!).toString()
              : (REQUIRED_NUTRIENTS as readonly Nutrients[]).includes(nutrient)
              ? ""
              : undefined
        }))
      ),
      pieceQuantity:
        food !== undefined && food.pieceQuantity !== undefined
          ? food.pieceQuantity.toString()
          : undefined
    };
  }
}
