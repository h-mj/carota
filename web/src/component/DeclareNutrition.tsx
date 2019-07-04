import { ErrorReasons, NutritionDeclaration } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled, { css } from "styled-components";
import { Component } from "./Component";
import { CheckBox } from "./CheckBox";
import { InputChangeHandler } from "./Input";
import { Label } from "./TextField";
import { DURATION, TIMING_FUNCTION } from "../styling/animations";
import {
  ACTIVE,
  DEFAULT_BORDER,
  DEFAULT_LABEL,
  ERROR
} from "../styling/colors";
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
 * Names of required nutrients.
 */
const REQUIRED_NUTRIENT_NAMES: Readonly<Set<NutrientNames>> = new Set([
  "energy",
  "fat",
  "carbohydrate",
  "protein"
]);

/**
 * Returns a map that maps nutrient names to booleans whether or not they are
 * enabled based on initial values.
 */
const areEnabled = (
  value?: Readonly<Partial<NutritionDeclaration>>
): Record<NutrientNames, boolean> => {
  const map: Record<string, boolean> = {};

  NUTRIENT_NAMES.forEach(name => {
    const nutrient = Array.isArray(name) ? name[0] : name;

    map[nutrient] =
      REQUIRED_NUTRIENT_NAMES.has(nutrient) ||
      (value !== undefined && value[nutrient] !== undefined);
  });

  return map;
};

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
   * Nutrition declaration amount values.
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
  /**
   * For each nutrient stores a boolean value whether or not it is enabled.
   */
  @observable private enabled = areEnabled(this.props.value);

  /**
   * Renders for each input name its row component.
   */
  public render() {
    return (
      <Table>
        {NUTRIENT_NAMES.map((name, index) =>
          this.renderRow(Array.isArray(name) ? name[0] : name, index)
        )}
      </Table>
    );
  }

  /**
   * Renders a row component alongside input enabling checkbox, nutrient name
   * header, amount input and unit text components.
   */
  private renderRow = (name: NutrientNames, index: number) => {
    const { autoFocus, reason, value } = this.props;

    return (
      <Container
        isDisabled={!this.enabled[name]}
        hasError={reason !== undefined && reason[name] !== undefined}
        key={name}
      >
        {!REQUIRED_NUTRIENT_NAMES.has(name) && (
          <CheckBox
            name={name}
            onChange={this.handleEnableChange}
            value={this.enabled[name]}
          />
        )}
        <Header>{this.translation.nutrients[name]}</Header>
        <Amount
          autoFocus={index === 0 && autoFocus}
          name={name}
          onChange={this.handleChange}
          type="number"
          value={(value && value[name]) || ""}
          disabled={!this.enabled[name]}
        />
        <Unit>{this.translation.units[name === "energy" ? "kcal" : "g"]}</Unit>
        {index === 0 && <Label>{this.translation.title}</Label>}
      </Container>
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

  /**
   * CheckBox change handler that enabled or disables an input.
   */
  @action
  private handleEnableChange: InputChangeHandler<boolean> = (name, value) => {
    this.enabled[name as NutrientNames] = value;

    // Reset the value of the input.
    if (this.props.onChange) {
      this.props.onChange(this.props.name, {
        ...this.props.value,
        [name]: value ? "" : undefined
      });
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
  min-width: 0;

  margin-left: ${UNIT / 4}rem;

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

  color: ${ACTIVE};
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

/**
 * Components coloring if there is no error.
 */
const disabledStyle = css`
  background-color: whitesmoke;
`;

/**
 * Components coloring if there is no error.
 */
const defaultStyle = css`
  z-index: 1;

  &:focus-within,
  &:focus-within > :not(${Amount}) {
    z-index: 2;
    color: ${ACTIVE};
  }
`;

/**
 * Components coloring if there is an error.
 */
const errorStyle = css`
  z-index: 3;

  &,
  & > :not(${Amount}) {
    color: ${ERROR};
  }
`;

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether or not there's an error.
   */
  hasError: boolean;

  /**
   * Whether or not associated input is disabled.
   */
  isDisabled: boolean;
}

const Container = styled.div<ContainerProps>`
  position: relative;

  display: flex;
  align-items: center;

  width: 100%;
  height: ${UNIT}rem;

  color: ${DEFAULT_BORDER};
  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: ${BORDER_RADIUS}rem;

  transition: ${DURATION}s ${TIMING_FUNCTION};

  ${props => (props.hasError ? errorStyle : defaultStyle)};
  ${props => props.isDisabled && disabledStyle};

  & > *:first-child {
    margin-left: ${UNIT / 4}rem;
  }
`;
