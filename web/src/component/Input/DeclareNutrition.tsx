import { ErrorReasons, NutritionDeclaration } from "api";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "../Component";
import { CheckBox } from "./CheckBox";
import { Field } from "./Field";
import { InputChangeHandler } from "./Input";
import { Label } from "./Label";
import { TRANSITION } from "../../styling/animations";
import { RESET } from "../../styling/stylesheets";
import { BORDER_RADIUS, UNIT_HEIGHT } from "../../styling/sizes";
import { getState, State, StateProps, styled } from "../../styling/theme";
import { resolveAfterTimeout } from "../../utility/promises";

/**
 * Union of all nutrient names.
 */
type NutrientNames = keyof NutritionDeclaration;

/**
 * Type that maps nutrient name to type `T`.
 */
type NutrientMap<T> = Record<NutrientNames, T>;

/**
 * Nutrient values type.
 */
type NutrientValues = Readonly<Partial<NutrientMap<string>>>;

/**
 * Nutrient error reasons type.
 */
type NutrientErrorReasons = Readonly<Partial<NutrientMap<ErrorReasons>>>;

/**
 * Names of nutrients in order that appear in the declaration. If nutrient name
 * is surrounded by array, corresponding row span text will be indented using
 * horizontal line symbol in front.
 */
const NUTRIENT_NAMES: Readonly<Array<NutrientNames>> = [
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
 * Returns a map that maps nutrient names to whether or not they are disabled
 * based on nutrient amount values.
 */
const areDisabled = (
  value?: NutrientValues
): Record<NutrientNames, boolean> => {
  const map: Record<string, boolean> = {};

  NUTRIENT_NAMES.forEach(name => {
    map[name] =
      !REQUIRED_NUTRIENT_NAMES.has(name) &&
      (value === undefined || value[name] === undefined);
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
   * Label text that will be rendered on top of the input.
   */
  label?: string;

  /**
   * Text field name that will be included as one of the `onChange` callback
   * parameters.
   */
  name?: string;

  /**
   * Function that will be called when text field value changes.
   */
  onChange?: InputChangeHandler<NutrientValues>;

  /**
   * Occurred error reasons related to internal input components.
   */
  reason?: NutrientErrorReasons;

  /**
   * Nutrition declaration amount values.
   */
  value: NutrientValues;
}

/**
 * Nutrition declaration component translation.
 */
interface DeclareNutritionTranslation {
  nutrients: Record<NutrientNames, string>;
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
   * For each nutrient stores a boolean value whether or not it is disabled.
   */
  @observable private disabled = areDisabled(this.props.value);

  /**
   * Currently focused nutrient name.
   */
  @observable private focusedNutrient?: string;

  /**
   * Nutrient input references.
   */
  private references: NutrientMap<React.RefObject<HTMLInputElement>>;

  /**
   * Creates a new instance of `DeclareNutrition` and creates reference objects
   * for each nutrient amount value input.
   */
  public constructor(props: DeclareNutritionProps) {
    super(props);

    this.references = Object.assign(
      {},
      ...NUTRIENT_NAMES.map(name => ({
        [name]: React.createRef<HTMLInputElement>()
      }))
    );
  }

  /**
   * Renders for each input name its row component.
   */
  public render() {
    return <Table>{NUTRIENT_NAMES.map(this.renderRow)}</Table>;
  }

  /**
   * Renders a row component alongside input enabling checkbox, nutrient name
   * header, amount input and unit text components.
   */
  private renderRow = (name: NutrientNames, index: number) => {
    const { autoFocus, label, reason, value } = this.props;
    const disabled = this.disabled[name];

    const state = getState(
      disabled,
      this.focusedNutrient === name,
      reason !== undefined && reason[name] !== undefined
    );

    return (
      <MarginedField key={name} state={state}>
        {index === 0 && label !== undefined && (
          <Label state={state}>{label}</Label>
        )}
        {!REQUIRED_NUTRIENT_NAMES.has(name) && (
          <CheckBox
            name={name}
            onChange={this.handleEnableChange}
            value={!disabled}
          />
        )}
        <Container state={state}>
          <Header>{this.translation.nutrients[name]}</Header>
          <Input
            autoFocus={index === 0 && autoFocus}
            name={name}
            onBlur={this.handleFocusChange}
            onChange={this.handleChange}
            onFocus={this.handleFocusChange}
            onWheelCapture={this.handleWheelCapture}
            ref={this.references[name]}
            type="number"
            value={value[name] || ""}
            disabled={disabled}
          />
          <Unit>
            {this.translation.units[name === "energy" ? "kcal" : "g"]}
          </Unit>
        </Container>
      </MarginedField>
    );
  };

  /**
   * Calls prop `onChange` if defined with input name and updated value.
   */
  private handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (this.props.onChange) {
      const { name, value } = this.props;
      const { name: inputName, value: inputValue } = event.target;

      this.props.onChange(name || "", { ...value, [inputName]: inputValue });
    }
  };

  /**
   * CheckBox change handler that enabled or disables an input.
   */
  @action
  private handleEnableChange: InputChangeHandler<boolean> = (name, value) => {
    this.disabled[name as NutrientNames] = !value;

    // Reset the value of the input.
    if (this.props.onChange) {
      this.props.onChange(this.props.name || "", {
        ...this.props.value,
        [name]: value ? "" : undefined
      });
    }
  };

  /**
   * Handles focus and blur events and sets currently focused nutrient name.
   */
  @action
  private handleFocusChange: React.FocusEventHandler<
    HTMLInputElement
  > = event => {
    this.focusedNutrient =
      event.type === "focus" ? event.target.name : undefined;
  };

  /**
   * Prevents wheel scroll altering input value.
   */
  private handleWheelCapture: React.WheelEventHandler<
    HTMLInputElement
  > = async event => {
    const reference = this.references[
      (event.target as any).name as NutrientNames
    ];

    // Make input readonly for a split second.
    reference.current!.readOnly = true;
    await resolveAfterTimeout(0);
    reference.current!.readOnly = false;
  };

  /**
   * Returns select default value.
   */
  public static getDefaultValue = () => ({});
}

/**
 * Component that contains row components for each nutrient type.
 */
const Table = styled.div`
  width: 100%;

  transition: ${TRANSITION};
`;

/**
 * Defined z-index value for each state.
 */
const Z_INDICES: Readonly<Record<State, number>> = {
  disabled: 0,
  default: 0,
  active: 2,
  invalid: 1
};

/**
 * `Field` component with extra styling.
 */
const MarginedField = styled(Field)`
  z-index: ${props => Z_INDICES[props.state]};

  border-radius: 0;

  &:first-child {
    border-radius: ${BORDER_RADIUS}rem ${BORDER_RADIUS}rem 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${BORDER_RADIUS}rem ${BORDER_RADIUS}rem;
  }

  & > *:not(${Label}) {
    margin-left: ${UNIT_HEIGHT / 4}rem;
  }
`;

/**
 * Component that contains header, input and unit components.
 */
const Container = styled.label<StateProps>`
  display: flex;
  align-items: center;

  min-width: 0;
  width: 100%;
  height: 100%;

  color: ${props => props.theme.states[props.state].color};

  flex-shrink: 1;
`;

/**
 * Component used for displaying nutrient name.
 */
const Header = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 0;
  height: 100%;

  overflow: hidden;
  text-overflow: ellipsis;

  white-space: nowrap;

  transition: ${TRANSITION};
`;

/**
 * Component used to display and edit nutrient amount.
 */
const Input = styled.input`
  ${RESET};

  flex: 1;
  min-width: ${UNIT_HEIGHT}rem;
  height: 100%;

  color: ${({ theme }) => theme.colorPrimary};
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
const Unit = styled(Header)`
  width: ${UNIT_HEIGHT}rem;
`;
