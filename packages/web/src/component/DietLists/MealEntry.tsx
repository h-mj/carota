import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../../base/Component";
import { Scenes } from "../../base/Scene";
import { Foodstuff } from "../../model/Foodstuff";
import { Meal } from "../../model/Meal";
import { styled } from "../../styling/theme";
import { Plus } from "../Plus";
import { Consumables } from "./Consumables";
import { NutrientQuantities } from "./NutrientQuantities";
import { Texts } from "./Texts";

/**
 * Meal list entry component props.
 */
interface MealEntryProps {
  /**
   * Meal index.
   */
  index: number;

  /**
   * Corresponding meal model instance.
   */
  meal: Meal;
}

/**
 * Component that displays the information of a meal model.
 */
@inject("meals", "views")
@observer
export class MealEntry extends Component<MealEntryProps> {
  /**
   * Pushed search scene.
   */
  private scene?: Scenes;

  /**
   * Renders components that display information of provided meal model.
   */
  public render() {
    const { meal } = this.props;
    const { consumables } = meal;

    return (
      <Draggable draggableId={meal.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
          >
            <TitleBar {...provided.dragHandleProps}>
              <Texts>{meal.name}</Texts>
              {consumables.length > 0 && <NutrientQuantities model={meal} />}
            </TitleBar>

            <Consumables meal={meal} />

            <PlusContainer>
              <Plus onClick={this.showSearch}>+</Plus>
            </PlusContainer>
          </Container>
        )}
      </Draggable>
    );
  }

  /**
   * Shows search scene when user clicks on `Plus` button component.
   */
  public showSearch = () => {
    this.scene = this.props.views!.push("main", "Search", {
      select: this.select
    });
  };

  /**
   * Callback function which is called when user selects foodstuff and its
   * quantity.
   */
  @action
  private select = (foodstuff: Foodstuff, quantity: number) => {
    this.props.meal.consume(foodstuff, quantity);
    this.props.views!.pop(this.scene!);
  };
}

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether the meal is being dragged.
   */
  isDragging: boolean;
}

/**
 * Container component that wraps all other components.
 */
const Container = styled.div<ContainerProps>`
  border-radius: ${({ theme }) => theme.borderRadius};
  border: solid 1px
    ${({ isDragging, theme }) =>
      isDragging ? theme.colorOrange : theme.borderColor};
  box-shadow: ${({ isDragging, theme }) =>
    isDragging ? `0 0 0 1px ${theme.colorOrange}` : "none"};

  background-color: ${({ theme }) => theme.backgroundColor};

  transition: box-shadow ${({ theme }) => theme.transition},
    border ${({ theme }) => theme.transition};
`;

/**
 * Meal title bar.
 */
const TitleBar = styled.div`
  width: 100%;
  display: flex;
  box-shadow: 0 1px 0 0 ${({ theme }) => theme.borderColor};

  @media screen and (max-width: 50rem) {
    flex-direction: column;
  }
`;

/**
 * Component that aligns `Plus` component exactly in the middle of meal on the
 * border.
 */
const PlusContainer = styled.div`
  width: 100%;
  height: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;
