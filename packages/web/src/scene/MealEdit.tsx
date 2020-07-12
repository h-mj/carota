import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { SceneComponent, SceneComponentProps } from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form } from "../component/collection/form";
import { Select } from "../component/Select";
import { Separator } from "../component/Separator";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Meal } from "../model/Meal";
import { any, append, ErrorsFor } from "../utility/form";

/**
 * Array of predefined meals that can be selected.
 */
const PREDEFINED_MEAL_NAMES = ["breakfast", "lunch", "dinner"] as const;

/**
 * Entered meal name validator.
 */
const nameValidator = deviate<string>().trim().nonempty();

/**
 * Meal edit component props.
 */
interface MealEditProps {
  /**
   * Currently loaded meals.
   */
  currentMeals: Meal[];

  /**
   * Currently visible date.
   */
  date: string;

  /**
   * Existing meal that is being edited.
   */
  meal?: Meal;

  /**
   * Scene close callback function.
   */
  onClose: () => void;
}

/**
 * Meal edit component translation.
 */
interface MealEditTranslation {
  /**
   * Create new meal submit button text.
   */
  createSubmit: string;

  /**
   * Create new meal title translation.
   */
  createTitle: string;

  /**
   * Delete button text.
   */
  delete: string;

  /**
   * Edit meal submit button text.
   */
  editSubmit: string;

  /**
   * Edit meal title translation.
   */
  editTitle: string;

  /**
   * Name text field label text.
   */
  label: string;

  /**
   * Meal name translations.
   */
  meals: Record<"breakfast" | "lunch" | "dinner", string>;

  /**
   * Separator label translation.
   */
  or: string;

  /**
   * Meal select helper text.
   */
  selectHelper: string;

  /**
   * Translations of select error reason messages.
   */
  selectReasons: Record<string, string>;

  /**
   * Name text field helper text.
   */
  textFieldHelper: string;

  /**
   * Translations of text field error reason messages.
   */
  textFieldReasons: Record<string, string>;
}

/**
 * Meal editing form values.
 */
interface Values {
  /**
   * Entered name field.
   */
  name: string;

  /**
   * Selected meal name.
   */
  selectedName?: string;
}

/**
 * Scene which is used to create or edit an existing meal.
 */
@inject("viewStore", "mealStore")
@observer
export class MealEdit extends SceneComponent<
  "MealEdit",
  MealEditProps,
  MealEditTranslation
> {
  /**
   * Form values.
   */
  @observable private values: Values = { name: "" };

  /**
   * Form field error reasons.
   */
  @observable private reasons: ErrorsFor<Values> = {};

  /**
   * Whether meal creation or renaming request has already been submitted.
   */
  private submitting = false;

  /**
   * Sets the name of this scene component.
   */
  public constructor(props: SceneComponentProps<"MealEdit"> & MealEditProps) {
    super("MealEdit", props);

    if (props.meal === undefined) {
      return;
    }

    this.values[
      this.getTranslatedPredefinedNames().includes(props.meal.name)
        ? "selectedName"
        : "name"
    ] = props.meal.name;
  }

  /**
   * Renders name selection form.
   */
  public render() {
    const options = this.getTranslatedPredefinedNames().map((label) => ({
      label,
      value: label,
    }));

    return (
      <>
        <TitleBar
          onClose={this.props.onClose}
          title={
            this.props.meal !== undefined
              ? this.translation.editTitle
              : this.translation.createTitle
          }
        />

        <Form noValidate={true} onSubmit={this.handleSubmit}>
          {options.length > 0 && (
            <>
              <Select
                errorMessage={
                  this.reasons.selectedName !== undefined
                    ? this.translation.selectReasons[this.reasons.selectedName]
                    : undefined
                }
                helperMessage={this.translation.selectHelper}
                invalid={this.reasons.selectedName !== undefined}
                name="meal"
                options={options}
                onChange={this.handleNameSelect}
                value={this.values.selectedName}
              />

              <Separator>
                <span>{this.translation.or}</span>
              </Separator>
            </>
          )}

          <TextField
            autoFocus={options.length === 0}
            errorMessage={
              this.reasons.name !== undefined
                ? this.translation.textFieldReasons[this.reasons.name]
                : undefined
            }
            helperMessage={this.translation.textFieldHelper}
            invalid={this.reasons.name !== undefined}
            label={this.translation.label}
            name="name"
            onChange={this.handleNameChange}
            value={this.values.name}
          />

          <Controls>
            {this.props.meal !== undefined &&
              this.props.meal.dishes.length === 0 && (
                <Button
                  invalid={any(this.reasons)}
                  onClick={this.handleDeletion}
                  secondary={true}
                  type="button"
                >
                  {this.translation.delete}
                </Button>
              )}
            <Button invalid={any(this.reasons)}>
              {this.props.meal !== undefined
                ? this.translation.editSubmit
                : this.translation.createSubmit}
            </Button>
          </Controls>
        </Form>
      </>
    );
  }

  /**
   * Returns an array of translated predefined meal names.
   */
  private getTranslatedPredefinedNames() {
    const translatedNames: string[] = [];

    for (const predefinedName of PREDEFINED_MEAL_NAMES) {
      const translatedName = this.translation.meals[predefinedName];

      if (
        !this.props.currentMeals.some((meal) => meal.name === translatedName) ||
        (this.props.meal !== undefined &&
          this.props.meal.name === translatedName)
      ) {
        translatedNames.push(translatedName);
      }
    }

    return translatedNames;
  }

  /**
   * Updates name field when select value changes.
   */
  @action
  private handleNameSelect = (_: string, value: string | undefined) => {
    this.values.name = "";
    this.values.selectedName = value;
  };

  /**
   * Updates name field when text field value changes.
   */
  @action
  private handleNameChange = (_: string, value: string) => {
    this.values.name = value;
    this.values.selectedName = undefined;
  };

  /**
   * Calls provided `onSelect` function on form submission.
   */
  @action
  private handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    const name =
      this.values.selectedName !== undefined
        ? this.values.selectedName
        : this.values.name;

    const result = nameValidator(name);

    if (result.ok) {
      const error =
        this.props.meal === undefined
          ? await this.props.mealStore!.create(result.value, this.props.date)
          : await this.props.meal.rename(result.value);

      if (error === undefined) {
        this.props.onClose();
        return;
      }

      this.reasons = append(this.reasons, error);
    } else {
      this.reasons.name = "nonempty";
      this.reasons.selectedName = "nonempty";
    }

    this.submitting = false;
  };

  /**
   * Handles delete button click mouse event.
   */
  private handleDeletion = async () => {
    if (this.props.meal === undefined || this.props.meal.dishes.length > 0) {
      return;
    }

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    await this.props.meal.delete();
    this.props.onClose();

    this.submitting = false;
  };
}
