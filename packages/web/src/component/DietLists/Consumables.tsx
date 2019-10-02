import { observer } from "mobx-react";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Component } from "../../base/Component";
import { Meal } from "../../model/Meal";
import { styled } from "../../styling/theme";
import { ConsumableEntry } from "./ConsumableEntry";

/**
 * Consumables component props.
 */
interface ConsumablesProps {
  /**
   * Meal which consumables will be rendered within this component.
   */
  meal: Meal;
}

/**
 * Component that displays all consumables of provided meal.
 */
@observer
export class Consumables extends Component<ConsumablesProps> {
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

/**
 * Container component that wraps all `ConsumableEntry` components.
 */
// prettier-ignore
const Container = styled.div`
  border-radius: 0 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;
