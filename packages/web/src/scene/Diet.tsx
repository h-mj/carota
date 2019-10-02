import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { DateSelect } from "../component/DateSelect/DateSelect";
import { Meals } from "../component/DietLists/Meals";
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
          <Meals mealList={meals} />
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
  private handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "meal") {
      await this.props.meals!.move(
        this.props.meals!.withId(draggableId)!,
        destination.index
      );
    } else {
      await this.props.meals!.reorder(
        this.props.meals!.withId(source.droppableId)!.withId(draggableId)!,
        this.props.meals!.withId(destination.droppableId)!,
        destination.index
      );
    }
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

  z-index: 2;

  background-color: ${({ theme }) => theme.backgroundColor};
`;
