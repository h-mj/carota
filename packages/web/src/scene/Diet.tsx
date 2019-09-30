import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { DateSelect } from "../component/DateSelect/DateSelect";
import { MealInfo } from "../component/MealInfo";
import { Plus } from "../component/Plus";
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
    const { meals } = this.props.meals!;

    return (
      <>
        <Sticky>
          <DateSelect date={this.date} onChange={this.setDate} />
        </Sticky>

        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable droppableId="meals" type="meal">
            {provided => (
              <Meals ref={provided.innerRef} {...provided.droppableProps}>
                {meals.map((meal, index) => (
                  <MealInfo key={meal.id} meal={meal} index={index} />
                ))}
                {provided.placeholder}
              </Meals>
            )}
          </Droppable>
        </DragDropContext>

        <Plus fixed={true} onClick={this.handleAddClick}>
          +
        </Plus>
      </>
    );
  }

  /**
   * Sets currently active date to specified date.
   */
  @action
  private setDate = async (date: Date) => {
    this.date = date;
    await this.props.meals!.get(date);
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

    await this.props.meals!.move(this.props.meals!.id(draggableId), index);
  };

  private handleAddClick = () => {
    this.props.meals!.add(this.props.meals!.meals.length.toString(), this.date);
  };
}

/**
 * Sticky wrapper component that wraps the `Calendar` component.
 */
const Sticky = styled.div`
  position: sticky;
  top: 0;

  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Component that contains all meal components.
 */
const Meals = styled.div`
  max-width: ${({ theme }) => theme.widthMedium};
  width: 100%;
  height: 100%;

  margin: auto;
  padding: ${({ theme }) => theme.padding};
  padding-bottom: 0;
  box-sizing: border-box;

  & > * {
    margin-bottom: ${({ theme }) => theme.padding};
  }
`;
