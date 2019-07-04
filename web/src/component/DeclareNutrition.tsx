import { ErrorReasons, NutritionDeclaration } from "api";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Component } from "./Component";
import { InputChangeHandler } from "./Input";
import { InputContainer } from "./Select";
import { Label } from "./TextField";
import { DURATION, TIMING_FUNCTION } from "../styling/animations";
import { DEFAULT_BORDER, DEFAULT_LABEL } from "../styling/colors";
import { BORDER_RADIUS, UNIT } from "../styling/sizes";
import { RESET } from "../styling/stylesheets";

/**
 * Union of all nutrient names.
 */
type NutrientNames = keyof NutritionDeclaration;

/**
 * Names of nutrients in order that appear in the declaration. If nutrient name
 * is surrounded by array, corresponding row span text will be indented using
 * horizontal line symbol in front.
 */
const NUTRIENT_NAMES: Readonly<Array<NutrientNames | [NutrientNames]>> = [
  "energy",
  "fat",
  ["saturates"],
  ["monoUnsaturates"],
  ["polyunsaturates"],
  "carbohydrate",
  ["sugars"],
  ["polyols"],
  ["starch"],
  "fibre",
  "protein",
  "salt"
];

/**
 * Nutrition declaration component props.
 */
export interface DeclareNutritionProps {
  /**
   * Whether or not first input should be in the focus automatically.
   */
  autoFocus?: boolean;

  /**
   * Text field name that will be included as one of the `onChange` callback
   * parameters.
   */
  name: string;

  /**
   * Function that will be called when text field value changes.
   */
  onChange?: InputChangeHandler<Partial<NutritionDeclaration>>;

  /**
   * Occurred error reasons related to internal input components.
   */
  reason?: Readonly<Partial<Record<NutrientNames, ErrorReasons>>>;
  /**
   * Text field value.
   */
  value?: Readonly<Partial<NutritionDeclaration>>;
}

/**
 * Nutrition declaration component translation.
 */
interface DeclareNutritionTranslation {
  nutrients: Record<NutrientNames, string>;
  title: string;
  units: { g: string; kcal: string };
}

/**
 * Component that is used to define or edit product nutrient values.
 */
@inject("views")
@observer
export class DeclareNutrition extends Component<
  DeclareNutritionProps,
  DeclareNutritionTranslation
> {
  public render() {
    return (
      <Table>
        {NUTRIENT_NAMES.map((name, index) =>
          Array.isArray(name)
            ? this.renderRow(name[0], index, true)
            : this.renderRow(name, index)
        )}
      </Table>
    );
  }

  /**
   * Renders a row component alongside nutrient name, amount and unit
   * components.
   */
  private renderRow = (name: NutrientNames, index: number, indent = false) => {
    const { autoFocus, reason, value } = this.props;

    // Label component is rendered after the first row element so that it is
    // possible to change Label style based on first row state using adjacency
    // selectors.
    return (
      <InputContainer
        hasError={reason !== undefined && reason[name] !== undefined}
        key={name}
      >
        <Header>
          {indent && "\u2015 " /* Horizontal bar symbol */}
          {this.translation.nutrients[name]}
        </Header>
        <Amount
          autoFocus={index === 0 && autoFocus}
          name={name}
          onChange={this.handleChange}
          type="number"
          value={(value && value[name]) || ""}
        />
        <Unit>{this.translation.units[name === "energy" ? "kcal" : "g"]}</Unit>
        {index === 0 && <Label>{this.translation.title}</Label>}
      </InputContainer>
    );
  };

  /**
   * Calls prop `onChange` if defined with input name and updated value.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.onChange) {
      const { name, value } = this.props;
      const { name: inputName, value: inputValue } = event.target;

      this.props.onChange(name, { ...value, [inputName]: inputValue });
    }
  };
}

/**
 * Component that contains row components for each nutrient type.
 */
const Table = styled.div`
  width: 100%;

  box-shadow: 0 0 0 1px ${DEFAULT_BORDER}, inset 0 0 0 1px ${DEFAULT_BORDER};
  border-radius: ${BORDER_RADIUS}rem;

  transition: ${DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Component used for displaying nutrient name.
 */
const Header = styled.span`
  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  color: ${DEFAULT_LABEL};
  white-space: nowrap;

  transition: ${DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Component used to display and edit nutrient amount.
 */
const Amount = styled.input`
  ${RESET};

  flex: 1;
  min-width: ${UNIT}rem;
  height: 100%;

  text-align: right;

  /* Hide up/down arrows on the right of the input */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

/**
 * Component used to display nutrient amount unit, either `g` or `kcal`.
 */
const Unit = styled.span`
  flex-shrink: 0;
  width: ${UNIT}rem;

  color: ${DEFAULT_LABEL};
  text-align: center;

  transition: ${DURATION}s ${TIMING_FUNCTION};
`;
