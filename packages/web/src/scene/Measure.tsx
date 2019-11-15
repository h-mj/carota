import { deviate, Failure } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Quantity } from "server";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form } from "../component/collection/form";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";

/**
 * Measure scene component props.
 */
interface MeasureProps {
  /**
   * Function that closes this scene.
   */
  close: () => void;

  /**
   * Quantity which is being measured.
   */
  quantity: Quantity;
}

/**
 * Measure scene component translation.
 */
interface MeasureTranslation {
  /**
   * Quantity specific helper message translations.
   */
  helper: Record<Quantity, string>;

  /**
   * Measurement value text field label text translation.
   */
  label: string;

  /**
   * Validation error reason message translations.
   */
  reasons: Record<Failure<typeof validator>, string>;

  /**
   * Title bar title translation.
   */
  title: string;

  /**
   * Form submit button text translation.
   */
  update: string;
}

/**
 * Measurement addition scene.
 */
@inject("measurements", "views")
@observer
export class Measure extends SceneComponent<
  "Measure",
  MeasureProps,
  MeasureTranslation
> {
  /**
   * Entered measurement value.
   */
  @observable private value = "";

  /**
   * Occurred error reason.
   */
  @observable private reason?: Failure<typeof validator>;

  /**
   * Creates a new instance of `Measure` and sets the name of this scene
   * component.
   */
  public constructor(
    props: MeasureProps & DefaultSceneComponentProps<"Measure">
  ) {
    super("Measure", props);
  }

  /**
   * Renders measurement addition scene component.
   */
  public render() {
    return (
      <>
        <TitleBar onClose={this.props.close} title={this.translation.title} />

        <Form noValidate={true} onSubmit={this.handleSubmit}>
          <TextField
            autoFocus={true}
            errorMessage={
              this.reason === undefined
                ? undefined
                : this.translation.reasons[this.reason]
            }
            helperMessage={this.translation.helper[this.props.quantity]}
            invalid={this.reason !== undefined}
            label={this.translation.label}
            name="value"
            onChange={this.handleChange}
            textAlign="right"
            type="number"
            unit={
              this.props.views!.translation.units[
                this.props.quantity === "Weight" ? "kg" : "cm"
              ]
            }
            value={this.value}
          />

          <Controls>
            <Button invalid={this.reason !== undefined}>
              {this.translation.update}
            </Button>
          </Controls>
        </Form>
      </>
    );
  }

  /**
   * Updates measurement value on change.
   */
  @action
  private handleChange = (_: string, value: string) => {
    this.value = value;
  };

  /**
   * Validates entered value and saves the measurement on success, otherwise
   * displays occurred error.
   */
  @action
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    const result = validator(this.value);

    if (!result.ok) {
      this.reason = result.value;
      return;
    }

    this.props.measurements!.save(
      this.props.quantity,
      new Date().toISOString(),
      result.value
    );

    this.props.close();
  };
}

/**
 * Validates and transforms user entered value.
 */
const validator = deviate<string>()
  .replace(",", ".")
  .trim()
  .nonempty()
  .toNumber()
  .positive()
  .round(2);
