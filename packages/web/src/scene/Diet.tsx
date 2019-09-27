import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Calendar } from "../component/Calendar";
import { Meal } from "../component/Meal";
import { styled } from "../styling/theme";

/**
 * Diet scene that is used to add, edit and delete the consumed meals at given date.
 */
@inject("meals")
@observer
export class Diet extends SceneComponent<"Diet"> {
  /**
   * Current date which meals are currently shown.
   */
  @observable private date!: Date; // Initialized by calling `this.setDate` in constructor.

  /**
   * Sets the name of this scene.
   */
  public constructor(props: DefaultSceneComponentProps<"Diet">) {
    super("Diet", props);

    this.setDate(new Date());
    this.props.meals!.clear();
  }

  /**
   * Renders `Table` components for each meal of currently selected date and
   * calendar component on the side, which is used to change the date.
   */
  public render() {
    const meals = this.props.meals!.ordered;

    return (
      <Container>
        <Main>
          <Button onClick={this.handleAddClick}>Add</Button>
          <DragDropContext onDragEnd={this.handleDragEnd}>
            <Droppable droppableId="meals" type="meal">
              {({ droppableProps, innerRef, placeholder }) => (
                <Meals ref={innerRef} {...droppableProps}>
                  {meals.map((meal, index) => (
                    <Meal key={meal.id} meal={meal} index={index} />
                  ))}
                  {placeholder}
                </Meals>
              )}
            </Droppable>
          </DragDropContext>
        </Main>

        <Side>
          <Calendar value={this.date} onChange={this.setDate} />
        </Side>
      </Container>
    );
  }

  /**
   * Sets currently active date to specified date.
   */
  @action
  private setDate = async (date: Date) => {
    this.date = date;
    await this.props.meals!.load(date);
  };

  /**
   * Handles drag end event.
   */
  private handleDragEnd = async ({ destination, draggableId }: DropResult) => {
    if (destination === undefined || destination === null) {
      return;
    }

    const { droppableId, index } = destination;

    if (droppableId !== "meals") {
      return;
    }

    await this.props.meals!.move(draggableId, index);
  };

  private handleAddClick = () => {
    this.props.meals!.create(
      this.props.meals!.ordered.length.toString(),
      this.date
    );
  };
}

/**
 * Wrapper component that contains all other components of this scene.
 */
const Container = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.padding};

  & > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.padding};
  }
`;

/**
 * Scene main content container.
 */
const Main = styled.div`
  width: 100%;
`;

/**
 * Component that contains all meal components.
 */
const Meals = styled.div`
  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.padding};
  }
`;

/**
 * Container which is positioned on the right and contains the calendar component.
 */
const Side = styled.div`
  max-width: ${({ theme }) => theme.formWidth};
  width: 100%;
`;
