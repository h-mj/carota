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
    <Droppable droppableId="meals" type="meal">
      {provided => (
        <Container ref={provided.innerRef} {...provided.droppableProps}>
          {this.props.mealList.map((meal, index) => (
            <MealEntry key={meal.id} meal={meal} index={index} />
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

  margin: auto;
  padding: ${({ theme }) => theme.padding};
  padding-bottom: 0;
  box-sizing: border-box;

  & > * {
    margin-bottom: ${({ theme }) => theme.padding};
  }
`;
