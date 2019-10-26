import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { DishesView } from "./DishesView";
import { ItemHeader } from "./ItemHeader";
import { NutrientQuantities } from "./NutrientQuantities";
import { Plus } from "./Plus";

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
@inject("meals", "views")
@observer
export class MealView extends Component<MealViewProps> {
  /**
   * Pushed search scene.
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
            <TitleBar {...provided.dragHandleProps}>
              <ItemHeader>
                <span>
                  {name}
                  <Edit onClick={this.showNameEdit}>↺</Edit>
                </span>
              </ItemHeader>

              {showQuantities && <NutrientQuantities model={meal} />}
            </TitleBar>

            <DishesView meal={meal} draggableType={this.props.draggableType} />

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
   * Callback function which is called when user selects a foodstuff and its
   * quantity.
   */
  @action
  private select = (foodstuff: Foodstuff, quantity: number) => {
    this.props.meal.consume(
      foodstuff,
      quantity,
      new Date(this.props.meal.date).getTime() <= new Date().getTime()
    );

    this.props.views!.pop(this.scene!);
  };

  /**
   * Enables meal entry editing.
   */
  @action
  private showNameEdit = () => {
    this.scene = this.props.views!.push("center", "Name", {
      name: this.props.meal.name,
      onSelect: this.handleSelect
    });
  };

  /**
   * Callback function which is called when user selects ma eal name.
   */
  @action
  private handleSelect = async (name: string) => {
    this.props.views!.pop(this.scene!);
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

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    flex-direction: column;
  }
`;

/**
 * Edit button that enables meal entry editing.
 */
const Edit = styled.button`
  ${RESET};

  margin-left: ${({ theme }) => theme.paddingSecondaryHalf};
  color: ${({ theme }) => theme.colorSecondary};
  cursor: pointer;
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
