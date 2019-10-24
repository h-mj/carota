import { observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../../base/Component";
import { Dish } from "../../model/Dish";
import { styled } from "../../styling/theme";
import { NutrientQuantities } from "./NutrientQuantities";
import { Texts } from "./Texts";

/**
 * Dish list entity component props.
 */
interface DishEntryProps {
  /**
   * Dish model which information is being displayed.
   */
  dish: Dish;

  /**
   * Dish entry index within the list.
   */
  index: number;
}

/**
 * Component that display information about specified dish.
 */
@observer
export class DishEntry extends Component<DishEntryProps> {
  public render() {
    const { dish } = this.props;

    return (
      <Draggable draggableId={dish.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Texts>
              <Quantity>
                {dish.quantity}
                {dish.foodstuff.unit}
              </Quantity>

              <span>{dish.foodstuff.name}</span>
            </Texts>

            <NutrientQuantities model={dish} />
          </Container>
        )}
      </Draggable>
    );
  }
}

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether dish is being dragged.
   */
  isDragging: boolean;
}

/**
 * Dish entry component container.
 */
const Container = styled.div<ContainerProps>`
  width: 100%;

  display: flex;

  box-shadow: ${({ isDragging, theme }) =>
    isDragging
      ? `0 0 0 1px ${theme.colorOrange}`
      : `0 1px 0 0 ${theme.borderColor}`};

  border: solid 1px;
  border-color: ${({ isDragging, theme }) =>
    isDragging ? theme.colorOrange : "transparent"};
  border-top-color: ${({ isDragging, theme }) =>
    isDragging ? theme.colorOrange : theme.borderColor};
  border-radius: ${({ isDragging, theme }) =>
    isDragging ? theme.borderRadius : "0"};
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.backgroundColor};

  transition: box-shadow ${({ theme }) => theme.transition},
    border-radius ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    flex-direction: column;
  }
`;

/**
 * Component that displays dish quantity.
 */
const Quantity = styled.span`
  width: ${({ theme }) => theme.height};

  flex-shrink: 0;
  justify-content: center;

  color: ${({ theme }) => theme.colorSecondary};
  text-align: center;
`;
