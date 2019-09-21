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
 * Component which is used to visually represent foodstuff nutritional composition.
 */
export class Diagram extends Component<DiagramProps> {
  /**
   * Renders the diagram.
   */
  public render() {
    const { carbohydrates, fat, protein } = this.props;

    const carbsRatio = Math.sqrt(4 * carbohydrates);
    const fatRatio = Math.sqrt(9 * fat);
    const proteinRatio = Math.sqrt(4 * protein);
    const ratioSum = carbsRatio + fatRatio + proteinRatio;

    // prettier-ignore
    return (
      <Bar>
        {proteinRatio > 0 && <NutrientPercentage color="#6b9cde" diameter={proteinRatio / ratioSum} />}
        {fatRatio > 0 && <NutrientPercentage color="#ff8200" diameter={fatRatio / ratioSum} />}
        {carbsRatio > 0 && <NutrientPercentage color="#fabc1f" diameter={carbsRatio / ratioSum} />}
        {ratioSum === 0 && <NutrientPercentage color="#dddddd" diameter={1} />}
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
  justify-content: center;
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
// prettier-ignore
const NutrientPercentage = styled.div<NutrientPercentageProps>`
  width: calc(${({ diameter }) => diameter} * ${({ theme }) => theme.height} / 2);
  height: calc(${({ diameter }) => diameter} * ${({ theme }) => theme.height} / 2);
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;
