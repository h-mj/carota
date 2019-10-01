import { observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../../base/Component";
import { Consumable } from "../../model/Consumable";
import { styled } from "../../styling/theme";

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
        {provided => (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {consumable.quantity}
            {consumable.foodstuff.unit} {consumable.foodstuff.name}
          </Container>
        )}
      </Draggable>
    );
  }
}

/**
 * Consumable entry component container.
 */
export const Container = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  display: flex;
  align-items: center;

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0 ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.backgroundColor};
`;
