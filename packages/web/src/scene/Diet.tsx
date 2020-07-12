import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";

import { Scenes } from "../base/Scene";
import { SceneComponent, SceneComponentProps } from "../base/SceneComponent";
import { Action } from "../component/Action";
import { DateSelect } from "../component/DateSelect/DateSelect";
import { Head } from "../component/Head";
import { MealList } from "../component/MealList";
import { styled } from "../styling/theme";
import { toIsoDateString } from "../utility/form";

/**
 * Diet scene component translation.
 */
interface DietTranslation {
  /**
   * Page title translation.
   */
  title: string;
}

/**
 * Diet scene that is used to add, edit and delete the consumed meals at given date.
 */
@inject("dishStore", "mealStore", "viewStore")
@observer
export class Diet extends SceneComponent<"Diet", {}, DietTranslation> {
  /**
   * Current date which meals are currently shown.
   */
  @observable private date!: string; // Initialized by calling `this.setDate` in constructor.

  /**
   * Current draggable type.
   */
  @observable private draggableType?: "meal" | "dish";

  /**
   * Pushed `Name` scene reference.
   */
  private scene?: Scenes;

  /**
   * Sets the name of this scene.
   */
  public constructor(props: SceneComponentProps<"Diet">) {
    super("Diet", props);

    this.setDate(toIsoDateString(new Date()));
  }

  /**
   * Renders `Table` components for each meal of currently selected date and
   * calendar component on the side, which is used to change the date.
   */
  public render() {
    return (
      <Container>
        <Head title={this.translation.title} />

        <Sticky>
          <DateSelect date={this.date} onChange={this.setDate} />
        </Sticky>

        <DragDropContext
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
        >
          <MealList
            draggableType={this.draggableType}
            meals={this.props.mealStore!.withDate(this.date)}
          />
        </DragDropContext>

        <Action fixed={true} onClick={this.handleAddClick} />
      </Container>
    );
  }

  /**
   * Sets currently active date to specified date.
   */
  @action
  private setDate = (date: string) => {
    this.date = date;
  };

  /**
   * Updates current draggable type on drag start.
   */
  @action
  private handleDragStart = (initial: DragStart) => {
    this.draggableType =
      initial.source.droppableId === "meals" ? "meal" : "dish";
  };

  /**
   * Handles drag end event.
   */
  @action
  private handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    const draggableType = this.draggableType;
    this.draggableType = undefined;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (draggableType === "meal") {
      const meal = this.props.mealStore!.withId(draggableId);

      if (meal === undefined) {
        return;
      }

      meal.insert(destination.index);

      return;
    }

    const dish = this.props.dishStore!.withId(draggableId);
    const meal = this.props.mealStore!.withId(destination.droppableId);

    if (dish === undefined || meal === undefined) {
      return;
    }

    dish.insert(meal, destination.index);
  };

  /**
   * Shows name selection scene when user clicks on `Plus` button.
   */
  @action
  private handleAddClick = () => {
    this.scene = this.props.viewStore!.push("center", "MealEdit", {
      currentMeals: this.props.mealStore!.withDate(this.date),
      date: this.date,
      onClose: this.handleMealEditClose,
    });
  };

  /**
   * Hides pushed `MealEdit` scene.
   */
  @action
  private handleMealEditClose = () => {
    this.props.viewStore!.pop(this.scene!);
  };
}

/**
 * Components that is used only to position the `TrashCan` component.
 */
const Container = styled.div`
  position: relative;
`;

/**
 * Sticky wrapper component that wraps the `Calendar` component.
 */
const Sticky = styled.div`
  position: sticky;
  top: 0;

  z-index: 2;

  background-color: ${({ theme }) => theme.backgroundColor};
`;
