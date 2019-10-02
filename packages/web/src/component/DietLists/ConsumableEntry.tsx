import { observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../../base/Component";
import { Consumable } from "../../model/Consumable";
import { styled } from "../../styling/theme";
import { NutrientQuantities } from "./NutrientQuantities";
import { Texts } from "./Texts";

/**
 * Consumable list entity component props.
 */
interface ConsumableEntryProps {
  /**
   * Consumable model which information is being displayed.
   */
  consumable: Consumable;

  /**
   * Consumable entry index within the list.
   */
  index: number;
}

/**
 * Component that display information about specified consumable.
 */
@observer
export class ConsumableEntry extends Component<ConsumableEntryProps> {
  public render() {
    const { consumable } = this.props;

    return (
      <Draggable draggableId={consumable.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Texts>
              <Quantity>
                {consumable.quantity}
                {consumable.foodstuff.unit}
              </Quantity>

              <span>{consumable.foodstuff.name}</span>
            </Texts>

            <NutrientQuantities model={consumable} />
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
   * Whether consumable is being dragged.
   */
  isDragging: boolean;
}

/**
 * Consumable entry component container.
 */
const Container = styled.div<ContainerProps>`
  width: 100%;

  display: flex;

  box-shadow: ${({ isDragging, theme }) =>
    isDragging
      ? `0 0 0 1px ${theme.orange}`
      : `0 1px 0 0 ${theme.borderColor}`};

  border: solid 1px;
  border-color: ${({ isDragging, theme }) =>
    isDragging ? theme.orange : "transparent"};
  border-top-color: ${({ isDragging, theme }) =>
    isDragging ? theme.orange : theme.borderColor};
  border-radius: ${({ isDragging, theme }) =>
    isDragging ? theme.borderRadius : "0"};
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.backgroundColor};

  transition: box-shadow ${({ theme }) => theme.transition},
    border-radius ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition};

  @media screen and (max-width: 50rem) {
    flex-direction: column;
  }
`;

/**
 * Component that displays consumable quantity.
 */
const Quantity = styled.span`
  width: ${({ theme }) => theme.height};

  flex-shrink: 0;
  justify-content: center;

  color: ${({ theme }) => theme.secondaryColor};
  text-align: center;
`;
