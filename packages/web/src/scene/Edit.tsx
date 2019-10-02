import { NutritionDeclarationDto, Units } from "api";
import { deviate, ok } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form, Label } from "../component/collection/form";
import { Group } from "../component/Group";
import { SceneTitle } from "../component/SceneTitle";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { Foodstuff } from "../model/Foodstuff";
import { any, append, ErrorsFor } from "../utility/form";

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
   * Foodstuff model that is being edited.
   */
  foodstuff?: Foodstuff;

  /**
   * Initial created foodstuff name.
   */
  name?: string;
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
  reasons: Partial<Record<string, string>>;
}

/**
 * Foodstuff edit scene translation.
 */
interface EditTranslation {
  /**
   * Scene title if new foodstuff is being created.
   */
  addTitle: string;

  /**
   * Delete confirmation message translation.
   */
  confirm: string;

  /**
   * Delete button text.
   */
  delete: string;

  /**
   * Scene title if existing foodstuff is being edited.
   */
  editTitle: string;

  /**
   * Registration form input translations.
   */
  inputs: { [InputName in InputNames]: InputTranslation };

  /**
   * Nutrient name translations.
   */
  nutrients: Record<Nutrients, string>;

  /**
   * Nutritional information label translation.
   */
  nutrientsLabel: string;

  /**
   * Per 100 units label translation. Continuation of nutrientsLabel.
   */
  nutrientsLabelPer: string;

  /**
   * Form submit button text.
   */
  submit: string;
}

/**
 * Nutrient amount values.
 */
type NutritionDeclarationValues = Record<RequiredNutrients, string> &
  Partial<Record<Exclude<Nutrients, RequiredNutrients>, string>>;

/**
 * Foodstuff editing form values object type.
 */
interface EditValues {
  id?: string;
  name: string;
  barcode?: string;
  unit?: Units;
  quantity?: string;
  nutritionDeclaration: NutritionDeclarationValues;
  pieceQuantity?: string;
}

/**
 * Set of optional fields that will have a check box in front of them.
 */
const OPTIONAL_FIELDS = new Set(["barcode", "quantity", "pieceQuantity"]);

/**
 * Initial form values when creating a new foodstuff.
 */
const DEFAULT_EDIT_VALUES: Readonly<EditValues> = {
  name: "",
  nutritionDeclaration: {
    carbohydrate: "",
    energy: "",
    fat: "",
    protein: ""
  }
};

/**
 * Converts a number to string.
 */
const numberToString = deviate<number>().append(number =>
  ok(number.toString())
);

/**
 * If value is `undefined`, returns `undefined` immediately, otherwise number is
 * converted to string.
 */
const optionalNumberToString = deviate<number | undefined>()
  .optional()
  .append(numberToString);

/**
 * Function that transforms `Foodstuff` type object into `EditValues` type
 * object.
 */
// prettier-ignore
const toValues = deviate<Foodstuff>().shape({
  id: deviate<string>(),
  name: deviate<string>(),
  barcode: deviate<string | undefined>(),
  unit: deviate<Units>(),
  quantity: deviate<number | undefined>().optional().append(number => ok(number.toString())),
  pieceQuantity: deviate<number | undefined>().optional().append(number => ok(number.toString())),
  nutritionDeclaration: deviate<NutritionDeclarationDto>().shape({
    energy: numberToString,
    fat: numberToString,
    saturates: optionalNumberToString,
    monoUnsaturates: optionalNumberToString,
    polyunsaturates: optionalNumberToString,
    carbohydrate: numberToString,
    sugars: optionalNumberToString,
    polyols: optionalNumberToString,
    starch: optionalNumberToString,
    fibre: optionalNumberToString,
    protein: numberToString,
    salt: optionalNumberToString
  })
});

/**
 * Converts a string into floating point number.
 */
const parseFloat = deviate<string>()
  .trim()
  .notEmpty()
  .replace(",", ".")
  .toNumber()
  .ge(0);

/**
 * Allows value to be `undefined`, otherwise converts it to a float.
 */
const optionalParseFloat = deviate<string | undefined>()
  .optional()
  .append(parseFloat);

/**
 * Function that transforms `EditValues` type object into `SaveFoodstuffDto`
 * type object.
 */
// prettier-ignore
const toBody = deviate<EditValues>().shape({
  id: deviate<string | undefined>(),
  name: deviate<string>().notEmpty(),
  barcode: deviate<string | undefined>().optional().notEmpty(),
  unit: deviate<Units | undefined>().defined(),
  quantity: optionalParseFloat,
  pieceQuantity: optionalParseFloat.gt(0),
  nutritionDeclaration: deviate<NutritionDeclarationValues>().shape({
    energy: parseFloat,
    fat: parseFloat,
    saturates: optionalParseFloat,
    monoUnsaturates: optionalParseFloat,
    polyunsaturates: optionalParseFloat,
    carbohydrate: parseFloat,
    sugars: optionalParseFloat,
    polyols: optionalParseFloat,
    starch: optionalParseFloat,
    fibre: optionalParseFloat,
    protein: parseFloat,
    salt: optionalParseFloat
  })
});

/**
 * Scene that allows user to either create new or edit existing foodstuffs.
 */
@inject("foodstuffs", "views")
@observer
export class Edit extends SceneComponent<"Edit", EditProps, EditTranslation> {
  /**
   * Foodstuff editing form field values.
   */
  @observable private values: EditValues;

  /**
   * Object that contains error reasons of occurred errors for each value.
   */
  @observable private reasons: ErrorsFor<EditValues> = {};

  /**
   * Sets the name of this scene.
   */
  public constructor(props: EditProps & DefaultSceneComponentProps<"Edit">) {
    super("Edit", props);

    this.values = this.getValues();

    // Set initial name if it is provided.
    if (this.props.foodstuff === undefined && this.props.name !== undefined) {
      this.values.name = this.props.name;
    }
  }

  /**
   * Renders foodstuff creation and editing form.
   */
  public render() {
    const { foodstuff, scene, views } = this.props;

    return (
      <Form noValidate={true} onSubmit={this.handleSubmit}>
        <SceneTitle
          scene={scene}
          title={
            foodstuff === undefined
              ? this.translation.addTitle
              : this.translation.editTitle
          }
        />

        <Group>
          {this.renderTextField("name")}
          {this.renderTextField("barcode")}
        </Group>

        <Group>
          <Select
            errorMessage={this.messageFor("unit")}
            invalid={this.reasons.unit !== undefined}
            label={this.translation.inputs.unit.label}
            name="unit"
            onChange={this.handleChange}
            options={[
              { label: views!.translation.units.g, value: "g" },
              { label: views!.translation.units.ml, value: "ml" }
            ]}
            value={this.values.unit}
          />

          {this.renderTextField("quantity")}
          {this.renderTextField("pieceQuantity")}
        </Group>

        <Group>
          <Label>
            {this.translation.nutrientsLabel}
            {this.values.unit !== undefined &&
              this.translation.nutrientsLabelPer.replace(
                "{unit}",
                this.props.views!.translation.units[this.values.unit!]
              )}
            :
          </Label>

          {NUTRIENTS.map(this.renderNutrientTextField)}
        </Group>

        <Controls>
          {foodstuff !== undefined && (
            <Button
              invalid={any(this.reasons)}
              secondary={true}
              type="button"
              onClick={this.showConfirmation}
            >
              {this.translation.delete}
            </Button>
          )}
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
      autoFocus={
        this.props.foodstuff === undefined && name === "name" ? true : undefined
      }
      errorMessage={this.messageFor(name)}
      invalid={this.reasons[name] !== undefined}
      label={this.translation.inputs[name].label}
      name={name}
      onChange={this.handleChange}
      optional={OPTIONAL_FIELDS.has(name)}
      textAlign="right"
      type={name === "barcode" ? "tel" : name === "name" ? "text" : "number"}
      unit={
        (name === "quantity" || name === "pieceQuantity") &&
        this.values.unit !== undefined
          ? this.props.views!.translation.units[this.values.unit!]
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
      unit={
        this.props.views!.translation.units[
          nutrient === "energy" ? "kcal" : "g"
        ]
      }
      value={this.values.nutritionDeclaration[nutrient]}
    />
  );

  /**
   * Updates input value on value change.
   */
  @action
  private handleChange = <T extends InputNames>(
    name: T,
    value: EditValues[T]
  ) => {
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
   * Prevents default form submit event and executes foodstuff saving procedure
   * instead.
   */
  @action
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    const result = toBody(this.values);

    const error = await this.props.views!.load(
      result.ok ? this.props.foodstuffs!.save(result.value) : undefined
    );

    if (result.ok && error === undefined) {
      this.props.views!.pop(this.props.scene);
    }

    this.reasons = append(result.ok ? {} : result.value, error);
  };

  /**
   * Shows confirmation screen when user clicks on delete button.
   */
  private showConfirmation = () => {
    this.props.views!.push("center", "Confirmation", {
      confirm: this.handleConfirmation,
      message: this.translation.confirm
    });
  };

  /**
   * Deletes the foodstuff after user has confirmed the deletion.
   */
  @action
  private handleConfirmation = async (confirmed: boolean) => {
    if (!confirmed) {
      return;
    }

    const { foodstuff, scene, views } = this.props;

    if ((await views!.load(foodstuff!.remove())) === undefined) {
      views!.pop(scene);
    }
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
   * Returns initial form values.
   */
  private getValues(): EditValues {
    const { foodstuff } = this.props;

    if (foodstuff === undefined) {
      return DEFAULT_EDIT_VALUES;
    }

    const result = toValues(foodstuff);

    if (!result.ok) {
      return DEFAULT_EDIT_VALUES;
    }

    return result.value;
  }
}
