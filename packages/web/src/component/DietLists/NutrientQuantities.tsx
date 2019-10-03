import { observer } from "mobx-react";
import * as React from "react";

import { Component } from "../../base/Component";
import { Consumable } from "../../model/Consumable";
import { REQUIRED_NUTRIENTS, RequiredNutrient } from "../../model/Foodstuff";
import { Meal } from "../../model/Meal";
import { styled } from "../../styling/theme";
import { Carbohydrate, Energy, Fat, Protein } from "../collection/icons";

/**
 * Nutrient quantities component props.
 */
interface NutrientQuantitiesProps {
  /**
   * Model which nutrient quantities will be displayed.
   */
  model: Consumable | Meal;
}

/**
 * Component that displays information about most important nutrients of provided model.
 */
@observer
export class NutrientQuantities extends Component<NutrientQuantitiesProps> {
  /**
   * Renders `NutrientQuantity` of each nutrient.
   */
  public render() {
    return (
      <Container>
        {REQUIRED_NUTRIENTS.map(nutrient => (
          <NutrientQuantity
            key={nutrient}
            model={this.props.model}
            nutrient={nutrient}
          />
        ))}
      </Container>
    );
  }
}

/**
 * Container component that wraps nutrient quantity components.
 */
const Container = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  display: grid;
  grid-gap: ${({ theme }) => theme.paddingSecondary};
  grid-template-columns: repeat(4, 1fr);

  padding: calc(${({ theme }) => theme.heightHalf} / 2)
    ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;
`;

/**
 * Object that maps nutrient names to their icons.
 */
const ICONS = {
  energy: Energy,
  protein: Protein,
  fat: Fat,
  carbohydrate: Carbohydrate
} as const;

/**
 * Nutrient quantity component props.
 */
interface NutrientQuantityProps {
  /**
   * Model which nutrient quantity is being displayed.
   */
  model: Consumable | Meal;

  /**
   * Nutrient which quantity is being displayed.
   */
  nutrient: RequiredNutrient;
}

/**
 * Component that displays quantity of provided nutrient of provided model.
 */
@observer
class NutrientQuantity extends Component<NutrientQuantityProps> {
  /**
   * Displays quantity of provided nutrient.
   */
  public render() {
    const { model, nutrient } = this.props;

    const Icon = ICONS[nutrient];

    const quantity = model.quantityOf(nutrient);
    const whole = (model instanceof Meal ? model : model.meal).quantityOf(
      nutrient
    );

    return (
      <Nutrient>
        <Icon />
        <Name>
          {Math.round(10 * this.props.model.quantityOf(this.props.nutrient)) /
            10}
        </Name>
        <Bar percentage={(100 * quantity) / whole} />
      </Nutrient>
    );
  }
}

/**
 * Nutrient container component that wraps all other components.
 */
const Nutrient = styled.div`
  position: relative;
  z-index: 0;

  width: 100%;
  height: 100%;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Bar component props.
 */
interface BarProps {
  /**
   * Nutrient percentage of the whole.
   */
  percentage: number;
}

/**
 * Bar that fills up `Container` component to visually represent nutrients
 * percentage within whole meal.
 */
const Bar = styled.div<BarProps>`
  position: absolute;
  left: 0;

  width: ${({ percentage }) => percentage}%;
  height: 100%;

  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundColorTranslucent};

  transition: ${({ theme }) => theme.transition};
`;

/**
 * Nutrient name wrapper.
 */
const Name = styled.div`
  margin-left: ${({ theme }) => theme.paddingSecondaryHalf};
  text-align: center;
`;
