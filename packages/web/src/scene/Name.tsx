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
import { SceneTitle } from "../component/SceneTitle";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { styled } from "../styling/theme";
import { any, ErrorsFor } from "../utility/form";

/**
 * Array of predefined meals that can be selected.
 */
const PREDEFINED_MEAL_NAMES = ["breakfast", "lunch", "dinner"] as const;

/**
 * Entered meal name validator.
 */
const nameValidator = deviate<string>()
  .trim()
  .notEmpty();

/**
 * Name component props.
 */
interface NameProps {
  /**
   * Name selection callback function.
   */
  onSelect: (name: string) => void;
}

/**
 * Name component translation.
 */
interface NameTranslation {
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
   * Submit button text.
   */
  submit: string;

  /**
   * Name text field helper text.
   */
  textFieldHelper: string;

  /**
   * Translations of text field error reason messages.
   */
  textFieldReasons: Record<string, string>;

  /**
   * Scene title translation.
   */
  title: string;
}

/**
 * Meal name selection form values.
 */
interface NameValues {
  /**
   * Selected meal name.
   */
  selectedName?: string;

  /**
   * Entered name field.
   */
  name: string;
}

/**
 * Scene which is used to select created meal name.
 */
@inject("meals", "views")
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
  }

  /**
   * Renders name selection form.
   */
  public render() {
    const options: { label: string; value: string }[] = [];

    for (const name of PREDEFINED_MEAL_NAMES) {
      const label = this.translation.meals[name];

      if (!this.props.meals!.hasWithName(label)) {
        options.push({ label, value: label });
      }
    }

    return (
      <Form noValidate={true} onSubmit={this.handleSubmit}>
        <SceneTitle scene={this.props.scene} title={this.translation.title} />

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

            <Or>
              <span>{this.translation.or}</span>
            </Or>
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
          <Button invalid={any(this.reasons)}>{this.translation.submit}</Button>
        </Controls>
      </Form>
    );
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
  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.values.selectedName !== undefined) {
      return this.props.onSelect(this.values.selectedName);
    }

    const result = nameValidator(this.values.name);

    if (result.ok) {
      return this.props.onSelect(this.values.name);
    }

    if (result.value === "empty") {
      this.reasons.name = "empty";
      this.reasons.selectedName = "empty";
    } else {
      this.reasons.name = result.value;
    }
  };
}

/**
 * Component that separates the meal name select and text field components.
 */
const Or = styled.div`
  width: 100%;
  height: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-bottom: solid 1px ${({ theme }) => theme.borderColor};

  & > span {
    padding: 0 ${({ theme }) => theme.paddingSecondary};
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.colorSecondary};
  }
`;
