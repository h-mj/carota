import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form } from "../component/collection/form";
import { Select } from "../component/Select";
import { Separator } from "../component/Separator";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Meal } from "../model/Meal";
import { ErrorsFor, any } from "../utility/form";

/**
 * Array of predefined meals that can be selected.
 */
const PREDEFINED_MEAL_NAMES = ["breakfast", "lunch", "dinner"] as const;

/**
 * Entered meal name validator.
 */
const nameValidator = deviate<string>()
  .trim()
  .nonempty();

/**
 * Name component props.
 */
interface NameProps {
  /**
   * Currently loaded meals.
   */
  currentMeals?: Meal[];

  /**
   * Existing meal initial name.
   */
  name?: string;

  /**
   * Name selection callback function.
   */
  onSelect: (name?: string) => void;
}

/**
 * Name component translation.
 */
interface NameTranslation {
  /**
   * Create new meal submit button text.
   */
  createSubmit: string;

  /**
   * Create new meal title translation.
   */
  createTitle: string;

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
 * Meal name selection form values.
 */
interface NameValues {
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
 * Scene which is used to select created meal name.
 */
@inject("views")
@observer
export class Name extends SceneComponent<"Name", NameProps, NameTranslation> {
  /**
   * Form values.
   */
  @observable private values: NameValues = { name: "" };

  /**
   * Form field error reasons.
   */
  @observable private reasons: ErrorsFor<NameValues> = {};

  /**
   * Sets the name of this scene component.
   */
  public constructor(props: NameProps & DefaultSceneComponentProps<"Name">) {
    super("Name", props);

    if (props.name === undefined) {
      return;
    }

    this.values[
      this.getUnusedPredefinedMealNames().includes(props.name)
        ? "selectedName"
        : "name"
    ] = props.name;
  }

  /**
   * Renders name selection form.
   */
  public render() {
    const options = this.getUnusedPredefinedMealNames().map(label => ({
      label,
      value: label
    }));

    return (
      <>
        <TitleBar
          onClose={this.handleClose}
          title={
            this.props.name !== undefined
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
            <Button invalid={any(this.reasons)}>
              {this.props.name !== undefined
                ? this.translation.editSubmit
                : this.translation.createSubmit}
            </Button>
          </Controls>
        </Form>
      </>
    );
  }

  /**
   * Returns an array of translated unused predefined meal names.
   */
  private getUnusedPredefinedMealNames() {
    const names: string[] = [];

    for (const name of PREDEFINED_MEAL_NAMES) {
      const label = this.translation.meals[name];

      if (
        (this.props.currentMeals !== undefined &&
          this.props.currentMeals.find(meal => meal.name === name) ===
            undefined) ||
        label === this.props.name
      ) {
        names.push(label);
      }
    }

    return names;
  }

  /**
   * Cancels the name selection.
   */
  private handleClose = () => {
    this.props.onSelect();
  };

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
  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.values.selectedName !== undefined) {
      return this.props.onSelect(this.values.selectedName);
    }

    const result = nameValidator(this.values.name);

    if (result.ok) {
      return this.props.onSelect(this.values.name);
    }

    if (result.value === "nonempty") {
      this.reasons.name = "nonempty";
      this.reasons.selectedName = "nonempty";
    } else {
      this.reasons.name = result.value;
    }
  };
}
