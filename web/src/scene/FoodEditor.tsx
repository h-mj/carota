import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Scene } from "./Scene";
import { Button } from "../component/Button";
import { InputErrorReasons } from "../component/Form";
import { Input, InputChangeHandler } from "../component/Input";
import { Thin } from "../component/container/Thin";
import { DEFAULT_BORDER, DEFAULT_LABEL } from "../styling/colors";
import { BORDER_RADIUS, UNIT } from "../styling/sizes";
import { anyErrors, createInputValues } from "../utility/forms";

/**
 * Array of all input names food editor uses. This array is used to
 * automatically create `FormValues` object and to improve typing.
 */
const FOOD_EDITOR_INPUT_NAMES = [
  "name",
  "barcode",
  "unit",
  "energy",
  "fat",
  "saturates",
  "monoUnsaturates",
  "polyunsaturates",
  "carbohydrate",
  "sugars",
  "polyols",
  "starch",
  "fibre",
  "protein",
  "salt"
] as const;

/**
 * Union of all input names.
 */
type FoodEditorInputNames = typeof FOOD_EDITOR_INPUT_NAMES[number];

/**
 * Basic food information input names.
 */
const FOOD_INFORMATION_INPUT_NAMES: Readonly<Array<FoodEditorInputNames>> = [
  "name",
  "barcode",
  "unit"
];

/**
 * Food nutrition information input names. If name is in a array, its name is
 * indented using horizontal line symbol.
 */
const NUTRITION_INFORMATION_INPUT_NAMES: Readonly<
  Array<FoodEditorInputNames | Array<FoodEditorInputNames>>
> = [
  "energy",
  "fat",
  ["saturates", "monoUnsaturates", "polyunsaturates"],
  "carbohydrate",
  ["sugars", "polyols", "starch"],
  "fibre",
  "protein",
  "salt"
];

/**
 * Food editor component that renders a form used to create or edit food
 * parameters.
 */
@inject("translations")
@observer
export class FoodEditor extends Scene<"foodEditor"> {
  /**
   * Input values.
   */
  @observable private values = createInputValues(FOOD_EDITOR_INPUT_NAMES);

  /**
   * Input error reasons.
   */
  @observable private reasons: InputErrorReasons<FoodEditorInputNames> = {};

  /**
   * Renders food editor component.
   */
  public render() {
    return (
      <Thin>
        <Form noValidate={true} onSubmit={this.handleSubmit}>
          {FOOD_INFORMATION_INPUT_NAMES.map(name => (
            <Input
              key={name}
              name={name}
              onChange={this.handleChange}
              reason={this.reasons[name]}
              value={this.values[name]}
            />
          ))}

          <NutritionInformation>
            <Row>
              <Title>Nutrition information</Title>
              {this.values.unit !== "" && (
                <>
                  <Label>100</Label>
                  <Unit>{this.values.unit}</Unit>
                </>
              )}
            </Row>
            {NUTRITION_INFORMATION_INPUT_NAMES.map(names =>
              Array.isArray(names)
                ? names.map(name => this.renderRow(name, true))
                : this.renderRow(names)
            )}
          </NutritionInformation>

          <Button hasError={anyErrors(this.reasons)}>Submit</Button>
        </Form>
      </Thin>
    );
  }

  /**
   * Renders a nutrition information input.
   *
   * @param name Name of the input.
   */
  private renderRow = (name: FoodEditorInputNames, indent = false) => (
    <Row key={name}>
      <Label>
        {indent && "\u2015 " /* Horizontal bar */}
        {this.props.translations!.translation.inputs[name].name}
      </Label>
      <Input
        basic={true}
        name={name}
        onChange={this.handleChange}
        reason={this.reasons[name]}
        value={this.values[name]}
      />
      <Unit>{name === "energy" ? "kcal" : "g"}</Unit>
    </Row>
  );

  /**
   * Updates changed input value.
   */
  @action
  private handleChange: InputChangeHandler<FoodEditorInputNames> = (
    name,
    value
  ) => {
    (this.values[name] as string) = value;
  };

  /**
   * Prevents default submit event.
   */
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();
  };
}

/**
 * Form component which contains all inputs and submit button.
 */
const Form = styled.form`
  & > * {
    margin-bottom: ${UNIT / 4}rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Div that contains nutrition information fields.
 */
const NutritionInformation = styled.div`
  box-shadow: 0 0 0 1px ${DEFAULT_BORDER}, inset 0 0 0 1px ${DEFAULT_BORDER};
  border-radius: ${BORDER_RADIUS}rem;
`;

/**
 * One of the nutrition information table rows.
 */
const Row = styled.div`
  width: 100%;
  height: ${UNIT}rem;

  display: flex;

  border-bottom: solid 2px ${DEFAULT_BORDER};

  &:last-of-type {
    border-bottom: 0;
  }
`;

/**
 * Label component that contains some kind of label.
 */
const Label = styled.div`
  height: 100%;

  display: flex;
  align-items: center;

  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  color: ${DEFAULT_LABEL};
  white-space: nowrap;
`;

/**
 * Label that fills entire width.
 */
const Title = styled(Label)`
  width: 100%;
`;

/**
 * Component that contains input value unit.
 */
const Unit = styled.div`
  width: ${UNIT}rem;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: ${DEFAULT_LABEL};
  white-space: nowrap;
`;
