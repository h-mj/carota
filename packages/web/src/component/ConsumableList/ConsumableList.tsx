import { observer } from "mobx-react";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Component } from "../../base/Component";
import { Meal } from "../../model/Meal";
import { styled } from "../../styling/theme";
import { ConsumableEntry } from "./ConsumableEntry";

/**
 * Meal consumable list component props.
 */
interface ConsumableListProps {
  /**
   * Meal which consumables will be rendered within this component.
   */
  meal: Meal;
}

/**
 * Component that displays a list of specified consumables.
 */
@observer
export class ConsumableList extends Component<ConsumableListProps> {
  /**
   * Renders a list of consumables.
   */
  public render() {
    const { consumables } = this.props.meal;

    return (
      <Droppable droppableId={this.props.meal.id} type="consumable">
        {provided => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {consumables.map((consumable, index) => (
              <ConsumableEntry
                key={consumable.id}
                consumable={consumable}
                index={index}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
  }
}

const Container = styled.div`
  padding: ${({ theme }) => theme.paddingSecondary};
  padding-bottom: 0;

  & > * {
    margin-bottom: ${({ theme }) => theme.paddingSecondary};
  }
`;
