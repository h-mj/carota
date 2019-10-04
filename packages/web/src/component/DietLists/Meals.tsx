import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Component } from "../../base/Component";
import { Meal } from "../../model/Meal";
import { styled } from "../../styling/theme";
import { MealEntry } from "./MealEntry";

/**
 * Meals component props.
 */
interface MealsProps {
  /**
   * Current draggable type.
   */
  draggableType?: "meal" | "consumable";

  /**
   * Array of meal models which information will be rendered.
   */
  mealList: Meal[];
}

/**
 * Component that displays information of each meal in the provided meal list.
 */
export class Meals extends Component<MealsProps> {
  /**
   * Renders all provided meals.
   */
  public render = () => (
    <Droppable
      droppableId="meals"
      isDropDisabled={this.props.draggableType !== "meal"}
    >
      {provided => (
        <Container ref={provided.innerRef} {...provided.droppableProps}>
          {this.props.mealList.map((meal, index) => (
            <MealEntry
              key={meal.id}
              meal={meal}
              index={index}
              draggableType={this.props.draggableType}
            />
          ))}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
}

/**
 * Component that contains all meal components.
 */
const Container = styled.div`
  max-width: ${({ theme }) => theme.widthMedium};
  width: 100%;

  margin: 0 auto;
  padding: ${({ theme }) => theme.padding};
  padding-bottom: 0;
  box-sizing: border-box;

  & > * {
    margin-bottom: ${({ theme }) => theme.padding};
  }
`;
