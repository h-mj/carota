import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Unit } from "server";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form } from "../component/collection/form";
import { SceneTitle } from "../component/SceneTitle";
import { Select } from "../component/Select";
import { TextField } from "../component/TextField";
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
   * Foodstuff selection callback.
   */
  select: (foodstuff: Foodstuff, quantity: number) => void;
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
 * Validates form values.
 */
// prettier-ignore
const validate = deviate<FormValues>().shape({
  quantity: deviate<string>().trim().nonempty().replace(",", ".").toNumber().greater(0),
  unit: deviate<Unit | "pcs" | undefined>().string()
});

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
    quantity: "",
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
      <Form noValidate={true} onSubmit={this.handleSubmit}>
        <SceneTitle scene={this.props.scene} title={this.translation.title} />

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
        onChange={this.handleChange}
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
   * Updates input value on value change.
   */
  @action
  private handleChange = <T extends keyof FormValues>(
    name: T,
    value: FormValues[T]
  ) => {
    this.values[name] = value;
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
          ? result.value.quantity * this.props.foodstuff.pieceQuantity!
          : result.value.quantity;

      this.props.select(this.props.foodstuff, quantity);
    } else {
      this.reasons = result.value;
    }
  };
}
