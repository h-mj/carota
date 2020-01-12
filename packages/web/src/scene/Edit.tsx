import { deviate, ok } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { NutritionDeclarationDto, Unit } from "server";

import { Scenes } from "../base/Scene";
import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form, Label } from "../component/collection/form";
import { Barcode } from "../component/collection/icons";
import { Group } from "../component/Group";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import {
  Foodstuff,
  REQUIRED_NUTRIENTS,
  RequiredNutrient
} from "../model/Foodstuff";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { ErrorsFor, any, append } from "../utility/form";
import { hasEnvironmentCamera } from "../utility/scanner";

/**
 * Union of text field input names.
 */
type TextFieldNames = "name" | "barcode" | "packageSize" | "pieceQuantity";

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
 * Edit scene props.
 */
interface EditProps {
  /**
   * Foodstuff model that is being edited.
   */
  foodstuff?: Foodstuff;

  /**
   * Function that is called after save.
   */
  onSave: (updated: boolean) => void;

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
type NutritionDeclarationValues = Record<RequiredNutrient, string> &
  Partial<Record<Exclude<Nutrients, RequiredNutrient>, string>>;

/**
 * Foodstuff editing form values object type.
 */
interface EditValues {
  id?: string;
  name: string;
  barcode?: string;
  unit?: Unit;
  packageSize?: string;
  nutritionDeclaration: NutritionDeclarationValues;
  pieceQuantity?: string;
}

/**
 * Set of optional fields that will have a check box in front of them.
 */
const OPTIONAL_FIELDS = new Set(["barcode", "packageSize", "pieceQuantity"]);

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
const numberToString = deviate<number>().then(number => ok(number.toString()));

/**
 * If value is `undefined`, returns `undefined` immediately, otherwise number is
 * converted to string.
 */
const optionalNumberToString = deviate<number | undefined>()
  .optional()
  .then(numberToString);

/**
 * Function that transforms `Foodstuff` type object into `EditValues` type
 * object.
 */
// prettier-ignore
const toValues = deviate<Foodstuff>().shape({
  id: deviate<string>(),
  name: deviate<string>(),
  barcode: deviate<string | undefined>(),
  unit: deviate<Unit>(),
  packageSize: optionalNumberToString,
  pieceQuantity: optionalNumberToString,
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
  .nonempty()
  .replace(",", ".")
  .toNumber()
  .min(0);

/**
 * Allows value to be `undefined`, otherwise converts it to a float.
 */
const optionalParseFloat = deviate<string | undefined>()
  .optional()
  .then(parseFloat);

/**
 * Function that transforms `EditValues` type object into `SaveFoodstuffDto`
 * type object.
 */
// prettier-ignore
const toBody = deviate<EditValues>().shape({
  id: deviate<string | undefined>(),
  name: deviate<string>().trim().nonempty(),
  barcode: deviate<string | undefined>().optional().replace(" ", "").nonempty().regexp(/^\d{13}$/),
  unit: deviate<Unit | undefined>().defined(),
  packageSize: optionalParseFloat.positive(),
  pieceQuantity: optionalParseFloat.positive(),
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
@inject("foodstuffStore", "viewStore")
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
   * Whether scan button should be rendered next to the barcode input..
   */
  @observable private showScanButton = false;

  /**
   * Pushed scene reference, either `Scanner` or `Confirmation`.
   */
  private scene?: Scenes;

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

    this.checkEnvironmentCamera();
  }

  /**
   * Renders foodstuff creation and editing form.
   */
  public render() {
    const { foodstuff } = this.props;

    return (
      <>
        <TitleBar
          onClose={this.handleClose}
          title={
            foodstuff === undefined
              ? this.translation.addTitle
              : this.translation.editTitle
          }
        />

        <Form noValidate={true} onSubmit={this.handleSubmit}>
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
                {
                  label: this.props.viewStore!.translation.units.g,
                  value: "g"
                },
                {
                  label: this.props.viewStore!.translation.units.ml,
                  value: "ml"
                }
              ]}
              value={this.values.unit}
            />

            {this.renderTextField("packageSize")}
            {this.renderTextField("pieceQuantity")}
          </Group>

          <Group>
            <Label>
              {this.translation.nutrientsLabel}
              {this.values.unit !== undefined &&
                this.translation.nutrientsLabelPer.replace(
                  "{unit}",
                  this.props.viewStore!.translation.units[this.values.unit]
                )}
              :
            </Label>

            {NUTRIENTS.map(this.renderNutrientTextField)}
          </Group>

          <Controls>
            {foodstuff !== undefined && foodstuff.deletable && (
              <Button
                invalid={any(this.reasons)}
                secondary={true}
                type="button"
                onClick={this.showConfirmation}
              >
                {this.translation.delete}
              </Button>
            )}
            <Button invalid={any(this.reasons)}>
              {this.translation.submit}
            </Button>
          </Controls>
        </Form>
      </>
    );
  }

  /**
   * Renders text field with name `name`.
   *
   * @param name Text field name which will be rendered.
   */
  private renderTextField = (name: TextFieldNames) => (
    <TextField
      append={
        name === "barcode" && this.showScanButton
          ? this.renderScanButton()
          : undefined
      }
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
        (name === "packageSize" || name === "pieceQuantity") &&
        this.values.unit !== undefined
          ? this.props.viewStore!.translation.units[this.values.unit]
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
        this.props.viewStore!.translation.units[
          nutrient === "energy" ? "kcal" : "g"
        ]
      }
      value={this.values.nutritionDeclaration[nutrient]}
    />
  );

  /**
   * Calls `onSave` callback function when title bar close button is clicked.
   */
  public handleClose = () => {
    this.props.onSave(false);
  };

  /**
   * Renders the scan button.
   */
  public renderScanButton = () => (
    <ScanButton
      disabled={this.values.barcode === undefined}
      type="button"
      onClick={this.handleScanClick}
    >
      <Barcode />
    </ScanButton>
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
   * Checks whether there's an environment camera.
   */
  @action
  private checkEnvironmentCamera = async () => {
    this.showScanButton = await hasEnvironmentCamera();
  };

  /**
   * Shows scanner scene on scan button click.
   */
  private handleScanClick = () => {
    this.scene = this.props.viewStore!.push("main", "Scanner", {
      onScan: this.handleScan
    });
  };

  /**
   * Sets barcode value after scan completion.
   */
  @action
  private handleScan = (barcode?: string) => {
    this.props.viewStore!.pop(this.scene!);

    if (barcode === undefined) {
      return;
    }

    this.values.barcode = barcode;
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

    if (!result.ok) {
      this.reasons = result.value;
      return;
    }

    const error = await this.props.foodstuffStore!.save(result.value);

    if (error === undefined) {
      this.props.onSave(true);
      return;
    }

    this.reasons = append({}, error);
  };

  /**
   * Shows confirmation screen when user clicks on delete button.
   */
  private showConfirmation = () => {
    this.scene = this.props.viewStore!.push("center", "Confirmation", {
      confirm: this.handleConfirmation,
      message: this.translation.confirm
    });
  };

  /**
   * Deletes the foodstuff after user has confirmed the deletion.
   */
  private handleConfirmation = async (confirmed: boolean) => {
    this.props.viewStore!.pop(this.scene!);

    if (!confirmed) {
      return;
    }

    await this.props.viewStore!.load(this.props.foodstuff!.delete());
    this.props.onSave(true);
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

/**
 * Scan button which is rendered after the barcode text field.
 */
const ScanButton = styled.button`
  ${RESET};

  width: ${({ theme }) => theme.heightHalf};
  height: ${({ theme }) => theme.heightHalf};

  & > svg {
    display: block;
    width: 100%;
    height: 0.75rem;
  }

  &:not(:disabled) {
    cursor: pointer;
  }
`;
