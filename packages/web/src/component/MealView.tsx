import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { styled } from "../styling/theme";
import { Action } from "./Action";
import { DishList } from "./DishList";
import { EditButton } from "./EditButton";
import { ItemHeader, ItemHeaderText, ItemHeaderTexts } from "./ItemHeader";
import { NutrientQuantities } from "./NutrientQuantities";

/**
 * Meal view component props.
 */
interface MealViewProps {
  /**
   * Current draggable type.
   */
  draggableType?: "meal" | "dish";

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
 * Component that displays the information of provided meal model.
 */
@inject("dishStore", "mealStore", "viewStore")
@observer
export class MealView extends Component<MealViewProps> {
  /**
   * Pushed scene reference, either `Search` or `Name` scene.
   */
  private scene?: Scenes;

  /**
   * Renders components that display information of provided meal model.
   */
  public render() {
    const { meal } = this.props;
    const { name } = meal;
    const dishes = [...meal.dishes];
    const showQuantities = dishes.some(dish => dish.eaten);

    return (
      <Draggable draggableId={meal.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
          >
            <ItemHeader {...provided.dragHandleProps}>
              <ItemHeaderTexts>
                <ItemHeaderText>{name}</ItemHeaderText>
                <EditButton onClick={this.showNameEdit} />
              </ItemHeaderTexts>

              {showQuantities && <NutrientQuantities model={meal} />}
            </ItemHeader>

            <DishList meal={meal} draggableType={this.props.draggableType} />

            <PlusContainer>
              <Action onClick={this.showSearch} />
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
    this.scene = this.props.viewStore!.push("main", "Search", {
      name: this.props.meal.name,
      onSelect: this.handleDishSelect
    });
  };

  /**
   * Callback function which is called when user selects a foodstuff and its
   * quantity.
   */
  @action
  private handleDishSelect = (foodstuff?: Foodstuff, quantity?: number) => {
    this.props.viewStore!.pop(this.scene!);

    if (foodstuff === undefined || quantity === undefined) {
      return;
    }

    this.props.dishStore!.create(
      this.props.meal,
      foodstuff,
      quantity,
      new Date(this.props.meal.date).getTime() <= new Date().getTime()
    );

    this.props.viewStore!.pop(this.scene!);
  };

  /**
   * Enables meal entry editing.
   */
  @action
  private showNameEdit = () => {
    this.scene = this.props.viewStore!.push("center", "Name", {
      currentMeals: this.props.mealStore!.mealsOf(this.props.meal.date),
      name: this.props.meal.name,
      onSelect: this.handleNameSelect
    });
  };

  /**
   * Callback function which is called when user selects a meal name.
   */
  @action
  private handleNameSelect = async (name?: string) => {
    this.props.viewStore!.pop(this.scene!);

    if (name === undefined) {
      return;
    }

    await this.props.meal.rename(name);
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
      isDragging ? theme.colorActive : theme.borderColor};
  box-shadow: ${({ isDragging, theme }) =>
    isDragging ? `0 0 0 1px ${theme.colorActive}` : "none"};

  background-color: ${({ theme }) => theme.backgroundColor};

  transition: box-shadow ${({ theme }) => theme.transition},
    border ${({ theme }) => theme.transition};
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
