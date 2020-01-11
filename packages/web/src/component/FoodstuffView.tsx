import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { TranslatedComponent } from "../base/TranslatedComponent";
import { Foodstuff } from "../model/Foodstuff";
import { styled } from "../styling/theme";
import { Carbohydrate, Energy, Fat, Protein } from "./collection/icons";
import { EditButton } from "./EditButton";
import { ItemHeader, ItemHeaderText, ItemHeaderTexts } from "./ItemHeader";

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
 * Foodstuff view component props.
 */
interface FoodstuffViewProps {
  /**
   * Corresponding foodstuff model instance.
   */
  foodstuff: Foodstuff;

  /**
   * Foodstuff selection callback.
   */
  onSelect: (foodstuff: Foodstuff) => void;

  /**
   * Shows specified foodstuff editor.
   */
  showEditor: (foodstuff: Foodstuff) => void;
}

/**
 * Foodstuff view component translations.
 */
interface FoodstuffViewTranslation {
  /**
   * Quantities per 100 units text.
   */
  per: string;
}

/**
 * Component that displays information about specified foodstuff.
 */
@inject("viewStore")
@observer
export class FoodstuffView extends TranslatedComponent<
  "FoodstuffView",
  FoodstuffViewProps,
  FoodstuffViewTranslation
> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: FoodstuffViewProps) {
    super("FoodstuffView", props);
  }

  /**
   * Renders specified foodstuff information.
   */
  public render() {
    const { editable, name, nutritionDeclaration, unit } = this.props.foodstuff;

    return (
      <Container onClick={this.handleSelect}>
        <Header>
          <ItemHeaderTexts>
            <ItemHeaderText>{name}</ItemHeaderText>
            {editable && <EditButton onClick={this.handleEdit} />}
          </ItemHeaderTexts>
        </Header>

        <Stats>
          <div>
            {this.translation.per.replace(
              "{unit}",
              this.props.viewStore!.translation.units[unit]
            )}
          </div>

          {Object.entries(ICONS).map(([nutrient, IconComponent]) => {
            const quantity = nutritionDeclaration[
              nutrient as Nutrient
            ].toLocaleString("et-EE", FORMAT_OPTIONS);

            const unit = this.props.viewStore!.translation.units[
              nutrient === "energy" ? "kcal" : "g"
            ];

            return (
              <Nutrient key={nutrient}>
                <div>
                  <IconComponent />
                </div>
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
   * Selects provided foodstuff on component click.
   */
  @action
  private handleSelect = () => {
    this.props.onSelect(this.props.foodstuff);
  };

  /**
   * Displays foodstuff editing form when user clicks on the edit button.
   */
  @action
  private handleEdit: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();

    this.props.showEditor(this.props.foodstuff);
  };
}

/**
 * Component that contains information about a foodstuff.
 */
const Container = styled.div`
  display: flex;
  flex-direction: column;

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-sizing: border-box;

  cursor: pointer;
`;

/**
 * Foodstuff header component.
 */
const Header = styled(ItemHeader)`
  flex-grow: 1;
  box-shadow: none;
`;

/**
 * Foodstuff nutritional stats wrapper.
 */
const Stats = styled.div`
  padding: ${({ theme }) => theme.paddingSecondary};
  padding-top: 0;
  box-sizing: border-box;

  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.paddingSecondaryHalf};
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
 * Displays nutrient quantity.
 */
const Quantity = styled.span`
  width: 100%;
  color: ${({ theme }) => theme.colorPrimary};
  font-feature-settings: "tnum" 1;
  text-align: center;
`;

/**
 * Displays nutrient amount unit.
 */
const Unit = styled.span`
  color: ${({ theme }) => theme.colorSecondary};
  text-align: right;
`;
