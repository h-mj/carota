import { deviate, ok } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Unit } from "server";

import { SceneComponent, SceneComponentProps } from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form, Title } from "../component/collection/form";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Dish } from "../model/Dish";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { ErrorsFor, any, append } from "../utility/form";

/**
 * Dish edit scene component props.
 */
interface DishEditProps {
  /**
   * Existing dish that is being edited.
   */
  dish?: Dish;

  /**
   * Foodstuff which quantity is being selected.
   */
  foodstuff: Foodstuff;

  /**
   * Meal that created/existing will/is part of.
   */
  meal: Meal;

  /**
   * Scene close callback function.
   */
  onClose: () => void;
}

/**
 * Translation of an input.
 */
interface InputTranslation {
  /**
   * Helper text translation.
   */
  helper: string;

  /**
   * Label translation.
   */
  label: string;

  /**
   * Error translations.
   */
  reasons: Record<string, string>;
}

/**
 * Dish edit scene component translation.
 */
interface DishEditTranslation {
  /**
   * Delete button text.
   */
  delete: string;

  /**
   * Full gram unit translation that will be inserted into unitHelper text.
   */
  g: string;

  /**
   * Full ml unit translation that will be inserted into unitHelper text.
   */
  ml: string;

  /**
   * Quantity input translation.
   */
  quantity: InputTranslation;

  /**
   * Select button translation.
   */
  select: string;

  /**
   * Quantity scene title.
   */
  title: string;

  /**
   * Unit input translation.
   */
  unit: InputTranslation;
}

/**
 * Quantity selection form values.
 */
interface Values {
  /**
   * Selected quantity value.
   */
  quantity: string;

  /**
   * Product quantity unit.
   */
  unit?: Unit | "pcs";
}

/**
 * Transforms and validates quantity text field value.
 */
const toValidQuantity = deviate<string>()
  .trim()
  .nonempty()
  .replace(",", ".")
  .toNumber()
  .positive();

/**
 * Validates form values.
 */
// prettier-ignore
const validate = deviate<Values>().shape({
  quantity: toValidQuantity,
  unit: deviate<Unit | "pcs" | undefined>().defined()
});

// Transforms quantity number to string.
const toQuantityString = deviate<number>()
  .round(2)
  .then(number => ok(number.toString()));

/**
 * Scene component that is used to create or edit existing dish.
 */
@inject("dishStore", "viewStore")
@observer
export class DishEdit extends SceneComponent<
  "DishEdit",
  DishEditProps,
  DishEditTranslation
> {
  /**
   * Quantity selection form values.
   */
  @observable private values: Values = {
    quantity:
      this.props.dish !== undefined ? this.props.dish.quantity.toString() : "",
    unit: this.props.foodstuff.unit
  };

  /**
   * Whether or not entered quantity is invalid.
   */
  @observable private reasons: ErrorsFor<Values> = {};

  /**
   * Whether dish creation or editing request has been submitted.
   */
  private submitting = false;

  /**
   * Sets the name of the scene of this component.
   */
  public constructor(props: SceneComponentProps<"DishEdit"> & DishEditProps) {
    super("DishEdit", props);
  }

  /**
   * Renders quantity selection form.
   */
  public render() {
    return (
      <>
        <TitleBar onClose={this.props.onClose} title={this.translation.title} />

        <Form noValidate={true} onSubmit={this.handleSubmit}>
          <Title>{this.props.foodstuff.name}</Title>

          {this.renderUnitInput()}
          {this.renderQuantityInput()}

          <Controls>
            {this.props.dish !== undefined && (
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
              {this.translation.select}
            </Button>
          </Controls>
        </Form>
      </>
    );
  }

  /**
   * Renders unit select component.
   */
  private renderUnitInput() {
    if (this.props.foodstuff.pieceQuantity === undefined) {
      // Can't be measured in pieces so do not render anything.
      return null;
    }

    const options = ([this.props.foodstuff.unit, "pcs"] as const).map(unit => ({
      label: this.props.viewStore!.translation.units[unit],
      value: unit
    }));

    return (
      <Select
        errorMessage={
          this.reasons.unit !== undefined
            ? this.translation.unit.reasons[this.reasons.unit]
            : undefined
        }
        helperMessage={this.translation.unit.helper.replace(
          "{unit}",
          this.translation[this.props.foodstuff.unit]
        )}
        invalid={this.reasons.unit !== undefined}
        label={this.translation.unit.label}
        name="unit"
        options={options}
        value={this.values.unit}
        onChange={this.handleUnitChange}
      />
    );
  }

  /**
   * Renders quantity text field.
   */
  private renderQuantityInput() {
    return (
      <TextField
        autoFocus={this.props.foodstuff.pieceQuantity === undefined}
        errorMessage={
          this.reasons.quantity !== undefined
            ? this.translation.quantity.reasons[this.reasons.quantity]
            : undefined
        }
        helperMessage={this.translation.quantity.helper}
        invalid={this.reasons.quantity !== undefined}
        label={this.translation.quantity.label}
        name="quantity"
        onChange={this.handleQuantityChange}
        textAlign="right"
        type="number"
        unit={
          this.values.unit !== undefined
            ? this.props.viewStore!.translation.units[this.values.unit]
            : undefined
        }
        value={this.values.quantity}
      />
    );
  }

  /**
   * Updates selected quantity on change.
   */
  @action
  private handleQuantityChange = (name: "quantity", value: string) => {
    this.values[name] = value;
  };

  /**
   * Updates input value on value change.
   */
  @action
  private handleUnitChange = (name: "unit", unit?: Unit | "pcs") => {
    if (unit === undefined) {
      return;
    }

    const previousUnit = this.values.unit;

    this.values[name] = unit;

    if (previousUnit === undefined) {
      return;
    }

    const result = toValidQuantity(this.values.quantity);

    if (!result.ok) {
      return;
    }

    this.values.quantity = toQuantityString(
      unit === "pcs"
        ? result.value / this.props.foodstuff.pieceQuantity!
        : result.value * this.props.foodstuff.pieceQuantity!
    ).value;
  };

  /**
   * Prevents default event, validates quantity value and calls quantity select
   * callback on form submit.
   */
  @action
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    const result = validate(this.values);

    if (result.ok) {
      const quantity =
        result.value.unit === "pcs"
          ? result.value.quantity * this.props.foodstuff.pieceQuantity!
          : result.value.quantity;

      const error =
        this.props.dish === undefined
          ? await this.props.dishStore!.create(
              this.props.meal,
              this.props.foodstuff,
              quantity,
              new Date(this.props.meal.date).getTime() <= new Date().getTime()
            )
          : await this.props.dish.setQuantity(quantity);

      if (error === undefined) {
        this.props.onClose();
        return;
      }

      this.reasons = append(this.reasons, error);
    } else {
      this.reasons = result.value;
    }

    this.submitting = false;
  };

  /**
   * Handles delete button click mouse event.
   */
  private handleDeletion = async () => {
    if (this.props.dish === undefined) {
      return;
    }

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    await this.props.dish.delete();
    this.props.onClose();

    this.submitting = false;
  };
}
