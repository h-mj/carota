import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { TranslatedComponent } from "../base/TranslatedComponent";
import { Foodstuff } from "../model/Foodstuff";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { Carbohydrate, Energy, Fat, Protein } from "./collection/icons";
import { Diagram } from "./Diagram";

/**
 * Object that maps nutrient names to its icon components. Foodstuff nutrient
 * stats will be rendered in the same order as defined in this object.
 */
const ICONS = {
  energy: Energy,
  protein: Protein,
  fat: Fat,
  carbohydrate: Carbohydrate
} as const;

/**
 * Union of information table nutrient names.
 */
type Nutrient = keyof typeof ICONS;

/**
 * `number.toLocaleString` function options.
 */
const FORMAT_OPTIONS = {
  minimumFractionDigits: 1
};

/**
 * Foodstuff info component props.
 */
interface FoodstuffInfoProps {
  /**
   * Corresponding foodstuff model instance.
   */
  foodstuff: Foodstuff;

  /**
   * Foodstuff selection callback.
   */
  select: (foodstuff: Foodstuff, quantity: number) => void;
}

/**
 * Foodstuff info component translations.
 */
interface FoodstuffInfoTranslation {
  /**
   * Quantities per 100 units text.
   */
  per: string;
}

/**
 * Component that displays information about specified foodstuff.
 */
@inject("views")
@observer
export class FoodstuffInfo extends TranslatedComponent<
  "FoodstuffInfo",
  FoodstuffInfoProps,
  FoodstuffInfoTranslation
> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: FoodstuffInfoProps) {
    super("FoodstuffInfo", props);
  }

  /**
   * Renders specified foodstuff information.
   */
  public render() {
    const { name, nutritionDeclaration, unit } = this.props.foodstuff;

    return (
      <Container onClick={this.handleSelect}>
        <Title>
          <Name>{name}</Name>

          <Edit onClick={this.handleEdit}>
            <Diagram
              carbohydrates={nutritionDeclaration.carbohydrate}
              fat={nutritionDeclaration.fat}
              protein={nutritionDeclaration.protein}
            />
          </Edit>
        </Title>

        <Stats>
          <div>
            {this.translation.per.replace(
              "{unit}",
              this.props.views!.translation.units[unit]
            )}
          </div>

          {Object.entries(ICONS).map(([nutrient, IconComponent]) => {
            const quantity = (
              100 * nutritionDeclaration[nutrient as Nutrient]
            ).toLocaleString("et-EE", FORMAT_OPTIONS);

            const unit = this.props.views!.translation.units[
              nutrient === "energy" ? "kcal" : "g"
            ];

            return (
              <Nutrient key={nutrient}>
                <Icon>
                  <IconComponent />
                </Icon>
                <Quantity>{quantity}</Quantity>
                <Unit>{unit}</Unit>
              </Nutrient>
            );
          })}
        </Stats>
      </Container>
    );
  }

  /**
   * Shows quantity selection when user clicks on this component.
   */
  @action
  private handleSelect = () => {
    this.props.views!.push("center", "Quantity", {
      foodstuff: this.props.foodstuff,
      select: this.props.select
    });
  };

  /**
   * Displays foodstuff editing form when user clicks on the edit button.
   */
  @action
  private handleEdit: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();

    this.props.views!.push("left", "Edit", {
      foodstuff: this.props.foodstuff
    });
  };
}

/**
 * Component that contains information about a foodstuff.
 */
const Container = styled.div`
  min-height: 11.5rem;

  display: flex;
  flex-direction: column;

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-sizing: border-box;

  cursor: pointer;
`;

/**
 * Food item title wrapper which contains foodstuff name and nutrient diagram
 * components.
 */
const Title = styled.div`
  width: 100%;

  display: flex;
  flex-grow: 1;
`;

/**
 * Clickable foodstuff name component.
 */
const Name = styled.button`
  ${RESET};

  min-height: ${({ theme }) => theme.lineHeight};
  height: min-content;

  flex-grow: 1;

  padding: ${({ theme }) => theme.paddingSecondary};
  box-sizing: content-box;

  color: ${({ theme }) => theme.primaryColor};
  line-height: ${({ theme }) => theme.lineHeight};
  word-break: break-word;

  cursor: pointer;
`;

/**
 * Foodstuff edit button.
 */
const Edit = styled.button`
  ${RESET};

  height: ${({ theme }) => theme.lineHeight};
  flex-shrink: 0;

  display: flex;
  align-items: center;

  padding: ${({ theme }) => theme.paddingSecondary};
  box-sizing: content-box;

  cursor: pointer;
`;

/**
 * Foodstuff nutritional stats wrapper.
 */
const Stats = styled.div`
  padding: ${({ theme }) => theme.paddingSecondary};
  padding-top: 0;
  box-sizing: border-box;

  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.halfPaddingSecondary};
  }
`;

/**
 * Single row of nutrient table.
 */
const Nutrient = styled.div`
  display: flex;
  align-items: center;

  & > * {
    width: 100%;
  }
`;

/**
 * Nutrient icon wrapper that resizes the icon inside.
 */
const Icon = styled.span`
  height: ${({ theme }) => theme.lineHeight};

  & > * {
    height: 100%;
  }
`;

/**
 * Displays nutrient quantity.
 */
const Quantity = styled.span`
  width: 100%;
  color: ${({ theme }) => theme.primaryColor};
  font-feature-settings: "tnum" 1;
  text-align: center;
`;

/**
 * Displays nutrient amount unit.
 */
const Unit = styled.span`
  color: ${({ theme }) => theme.secondaryColor};
  text-align: right;
`;
