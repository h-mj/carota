import * as React from "react";

import { Component } from "../base/Component";
import { styled } from "../styling/theme";

/**
 * Diagram component props.
 */
interface DiagramProps {
  /**
   * Amount of carbohydrates.
   */
  carbohydrates: number;

  /**
   * Amount of fat.
   */
  fat: number;

  /**
   * Amount of protein.
   */
  protein: number;
}

/**
 * Component which is used to visually represent food item nutritional composition.
 */
export class Diagram extends Component<DiagramProps> {
  /**
   * Renders the diagram.
   */
  public render() {
    const { carbohydrates, fat, protein } = this.props;

    const carbsSqrt = Math.sqrt(carbohydrates);
    const fatSqrt = Math.sqrt(fat);
    const proteinSqrt = Math.sqrt(protein);
    const sqrtSum = carbsSqrt + fatSqrt + proteinSqrt;

    return (
      <Bar>
        <NutrientPercentage color="#ff8200" diameter={fatSqrt / sqrtSum} />
        <NutrientPercentage color="#6b9cde" diameter={proteinSqrt / sqrtSum} />
        <NutrientPercentage color="#fabc1f" diameter={carbsSqrt / sqrtSum} />
      </Bar>
    );
  }
}

/**
 * Component which contains the nutrient percentage bars.
 */
const Bar = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Nutrient percentage component props.
 */
interface NutrientPercentageProps {
  /**
   * Bar color.
   */
  color: string;

  /**
   * Nutrient percentage.
   */
  diameter: number;
}

/**
 * Circular container that fills `Bar` component proportionally to `diameter` prop.
 */
const NutrientPercentage = styled.div<NutrientPercentageProps>`
  width: calc(
    ${({ diameter }) => diameter} * ${({ theme }) => theme.padding} / 2
  );
  height: calc(
    ${({ diameter }) => diameter} * ${({ theme }) => theme.padding} / 2
  );
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;
