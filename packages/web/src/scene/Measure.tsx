import { deviate, Failure } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Quantity } from "server";

import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";
import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form } from "../component/collection/form";
import { DeleteButton } from "../component/DeleteButton";
import { Separator } from "../component/Separator";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Measurement } from "../model/Measurement";
import { styled } from "../styling/theme";
import { toDateString } from "../utility/form";

/**
 * Validates and transforms entered measurement value.
 */
const validator = deviate<string>()
  .replace(",", ".")
  .trim()
  .nonempty()
  .toNumber()
  .positive()
  .round(2);

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
   * Measurement deletion confirmation message translation.
   */
  confirmation: string;

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
   * Pushed confirmation screen reference.
   */
  private scene?: Scenes;

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
    const measurements = this.props.measurements!.measurementsOf(
      this.props.quantity
    );

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

          {measurements.length > 0 && (
            <>
              <Separator>
                <span>Measurements</span>
              </Separator>

              {measurements.map(measurement => (
                <Entry measurement={measurement} onDelete={this.handleDelete} />
              ))}
            </>
          )}
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
      new Date(),
      result.value
    );

    this.props.close();
  };

  /**
   * Shows confirmation scene on measurement deletion.
   */
  private handleDelete = (measurement: Measurement) => {
    this.scene = this.props.views!.push("center", "Confirmation", {
      message: this.translation.confirmation,
      confirm: this.confirm(measurement)
    });
  };

  /**
   * Hides pushed confirmation scene and deletes specified measurement if user
   * confirmed the deletion.
   */
  private confirm = (measurement: Measurement) => (confirmation: boolean) => {
    this.props.views!.pop(this.scene!);

    if (confirmation) {
      measurement.delete();
    }
  };
}

/**
 * Entry component props.
 */
interface EntryProps {
  /**
   * Measurement which information is being shown.
   */
  measurement: Measurement;

  /**
   * Measurement delete button click callback function.
   */
  onDelete: (measurement: Measurement) => void;
}

/**
 * Component which shows information about provided measurement.
 */
@observer
class Entry extends Component<EntryProps> {
  /**
   * Renders measurement information.
   */
  public render() {
    return (
      <Row key={this.props.measurement.id}>
        <Column>{toDateString(new Date(this.props.measurement.date))}</Column>
        <Column>{this.props.measurement.value}</Column>
        <DeleteButton onClick={this.handleClick} />
      </Row>
    );
  }

  /**
   * Calls on delete callback function on delete button click.
   */
  private handleClick = () => {
    this.props.onDelete(this.props.measurement);
  };
}

/**
 * Measurements table row component.
 */
const Row = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};
  box-sizing: border-box;

  display: flex;
  align-items: center;

  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.borderColor};
  }
`;

/**
 * Row column component.
 */
const Column = styled.div`
  width: 100%;
`;
