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
import { TextField } from "../component/TextField";
import { Food } from "../model/Food";

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
 * Transformation that transforms string quantity to numeric value.
 */
const validate = deviate<string>()
  .trim()
  .notEmpty()
  .toNumber();

/**
 * Quantity scene component translation.I
 */
interface QuantityTranslation {
  /**
   * Quantity text label translation.
   */
  quantity: string;

  /**
   * Select button translation.
   */
  select: string;
}

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
   * Selected quantity value.
   */
  @observable private quantity = "";

  /**
   * Whether or not entered quantity is invalid.
   */
  @observable private invalid = false;

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
        <TextField
          autoFocus={true}
          invalid={this.invalid}
          label={this.translation.quantity}
          name="quantity"
          onChange={this.handleChange}
          textAlign="right"
          type="number"
          unit={this.props.views!.translation.units[this.props.food.unit]}
          value={this.quantity}
        />
        <Controls>
          <Button invalid={this.invalid}>{this.translation.quantity}</Button>
        </Controls>
      </Form>
    );
  }

  /**
   * Updates quantity value when value of text field changes.
   */
  @action
  private handleChange = (name: "quantity", value: string) => {
    this[name] = value;
  };

  /**
   * Prevents default event, validates quantity value and calls quantity select
   * callback on form submit.
   */
  @action
  private handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    const result = validate(this.quantity);

    if (result.kind !== "Err") {
      this.props.select(this.props.food, result.value);
    } else {
      this.invalid = true;
    }
  };
}
