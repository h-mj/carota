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
import { from } from "../utility/shift";

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
const TRANSFORMATION = from<string>()
  .trim()
  .parseFloat()
  .build();

/**
 * Scene component that is used to select a quantity of some food item.
 */
@inject("views")
@observer
export class Quantity extends SceneComponent<"Quantity", QuantityProps> {
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
          name="quantity"
          onChange={this.handleChange}
          type="number"
          unit={this.props.views!.translation.units[this.props.food.unit]}
          value={this.quantity}
        />
        <Controls>
          <Button>Select</Button>
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

    const result = TRANSFORMATION(this.quantity);

    if (result.kind === "Ok") {
      this.props.select(this.props.food, result.value);
    } else {
      this.invalid = true;
    }
  };
}
