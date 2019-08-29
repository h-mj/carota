import { Units } from "api";
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
import { TextField } from "../component/TextField";
import { Food } from "../model/Food";
import { ErrorReasonsFor, any } from "../utility/form";

/**
 * Quantity scene component props.
 */
interface QuantityProps {
  /**
   * Food item which quantity is being selected.
   */
  food: Food;

  /**
   * Food item selection callback.
   */
  select: (food: Food, quantity: number) => void;
}

/**
 * Quantity scene component translation.I
 */
interface QuantityTranslation {
  /**
   * Full gram unit translation that will be inserted into unitHelper test.
   */
  g: string;

  /**
   * Full ml unit translation that will be inserted into unitHelper test.
   */
  ml: string;

  /**
   * Quantity text label translation.
   */
  quantity: string;

  /**
   * Quantity text field helper text.
   */
  quantityHelper: string;

  /**
   * Select button translation.
   */
  select: string;

  /**
   * Unit select label translation.
   */
  unit: string;

  /**
   * Unit select helper text.
   */
  unitHelper: string;
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
  unit?: Units | "pcs";
}

/**
 * Function that validates form values.
 */
const validate = deviate<FormValues>().shape({
  quantity: deviate<string>()
    .trim()
    .notEmpty()
    .replace(",", ".")
    .toNumber()
    .gt(0),
  unit: deviate<Units | "pcs" | undefined>().defined()
});

/**
 * Scene component that is used to select a quantity of some food item.
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
    quantity: "",
    unit: this.props.food.unit
  };

  /**
   * Whether or not entered quantity is invalid.
   */
  @observable private reasons: ErrorReasonsFor<FormValues> = {};

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
      <Form noValidate={true} onSubmit={this.handleSubmit}>
        {this.renderUnitInput()}
        {this.renderQuantityInput()}

        <Controls>
          <Button invalid={any(this.reasons)}>{this.translation.select}</Button>
        </Controls>
      </Form>
    );
  }

  /**
   * Renders unit select component.
   */
  private renderUnitInput() {
    if (this.props.food.pieceQuantity === undefined) {
      // Can't be measured in pieces so do not render anything.
      return null;
    }

    const options = ([this.props.food.unit, "pcs"] as const).map(unit => ({
      label: this.props.views!.translation.units[unit],
      value: unit
    }));

    return (
      <Select
        helperMessage={this.translation.unitHelper.replace(
          "{unit}",
          this.translation[this.props.food.unit]
        )}
        invalid={this.reasons.unit !== undefined}
        label={this.translation.unit}
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
        autoFocus={this.props.food.pieceQuantity === undefined}
        helperMessage={this.translation.quantityHelper}
        invalid={this.reasons.quantity !== undefined}
        label={this.translation.quantity}
        name="quantity"
        onChange={this.handleChange}
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
   * Updates quantity value when value of text field changes.
   */
  @action
  private handleChange = (name: "quantity", value: string) => {
    this.values[name] = value;
  };

  /**
   * Updates quantity unit when value of select changes.
   */
  @action
  private handleUnitChange = (
    name: "unit",
    unit: Units | "pcs" | undefined
  ) => {
    this.values[name] = unit;
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
      const quantity =
        result.value.unit === "pcs"
          ? result.value.quantity * this.props.food.pieceQuantity!
          : result.value.quantity;

      this.props.select(this.props.food, quantity);
    } else {
      // TODO: Convert error strings to ErrorReasons
      this.reasons = result.value as any;
    }
  };
}
