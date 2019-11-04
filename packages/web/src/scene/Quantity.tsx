import { deviate, ok } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Unit } from "server";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form, Title } from "../component/collection/form";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Foodstuff } from "../model/Foodstuff";
import { any, ErrorsFor } from "../utility/form";

/**
 * Quantity scene component props.
 */
interface QuantityProps {
  /**
   * Foodstuff which quantity is being selected.
   */
  foodstuff: Foodstuff;

  /**
   * Initial quantity value.
   */
  quantity?: number;

  /**
   * Foodstuff selection callback.
   */
  onSelect: (quantity?: number) => void;
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
 * Quantity scene component translation.
 */
interface QuantityTranslation {
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
interface FormValues {
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
const validate = deviate<FormValues>().shape({
  quantity: toValidQuantity,
  unit: deviate<Unit | "pcs" | undefined>().defined()
});

// Transforms quantity number to string.
const toQuantityString = deviate<number>()
  .round(2)
  .then(number => ok(number.toString()));

/**
 * Scene component that is used to select a quantity of some foodstuff.
 */
@inject("views")
@observer
export class Quantity extends SceneComponent<
  "Quantity",
  QuantityProps,
  QuantityTranslation
> {
  /**
   * Quantity selection form values.
   */
  @observable private values: FormValues = {
    quantity:
      this.props.quantity !== undefined ? this.props.quantity.toString() : "",
    unit: this.props.foodstuff.unit
  };

  /**
   * Whether or not entered quantity is invalid.
   */
  @observable private reasons: ErrorsFor<FormValues> = {};

  /**
   * Sets the name of the scene of this component.
   */
  public constructor(
    props: QuantityProps & DefaultSceneComponentProps<"Quantity">
  ) {
    super("Quantity", props);
  }

  /**
   * Renders quantity selection form.
   */
  public render() {
    return (
      <>
        <TitleBar onClose={this.handleClose} title={this.translation.title} />

        <Form noValidate={true} onSubmit={this.handleSubmit}>
          <Title>{this.props.foodstuff.name}</Title>

          {this.renderUnitInput()}
          {this.renderQuantityInput()}

          <Controls>
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
      label: this.props.views!.translation.units[unit],
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
            ? this.props.views!.translation.units[this.values.unit]
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
  private handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    const result = validate(this.values);

    if (result.ok) {
      this.props.onSelect(
        result.value.unit === "pcs"
          ? result.value.quantity * this.props.foodstuff.pieceQuantity!
          : result.value.quantity
      );
    } else {
      this.reasons = result.value;
    }
  };

  /**
   * Calls quantity selection callback with `undefined` quantity.
   */
  private handleClose = () => {
    this.props.onSelect();
  };
}
