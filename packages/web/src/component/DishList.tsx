import { observer } from "mobx-react";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { Meal } from "../model/Meal";
import { styled } from "../styling/theme";
import { DishView } from "./DishView";

/**
 * Dishes view component props.
 */
interface DishListProps {
  /**
   * Current draggable type.
   */
  draggableType?: "meal" | "dish";

  /**
   * Meal which dishes will be rendered within this component.
   */
  meal: Meal;
}

/**
 * Component that displays all dishes of provided meal.
 */
@observer
export class DishList extends Component<DishListProps> {
  /**
   * Renders a list of dishes.
   */
  public render() {
    const dishes = [...this.props.meal.dishes];

    return (
      <Droppable
        droppableId={this.props.meal.id}
        isDropDisabled={this.props.draggableType !== "dish"}
      >
        {provided => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {dishes.map((dish, index) => (
              <DishView key={dish.id} dish={dish} index={index} />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
  }
}

/**
 * Container component that wraps all `DishEntry` components.
 */
// prettier-ignore
const Container = styled.div`
  border-radius: 0 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  min-height: ${({theme}) => theme.height};
`;
