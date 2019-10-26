import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { DateSelect } from "../component/DateSelect/DateSelect";
import { Head } from "../component/Head";
import { MealsView } from "../component/MealsView";
import { Plus } from "../component/Plus";
import { TrashCan } from "../component/TrashCan";
import { styled } from "../styling/theme";

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
@inject("meals", "views")
@observer
export class Diet extends SceneComponent<"Diet", {}, DietTranslation> {
  /**
   * Current date which meals are currently shown.
   */
  @observable private date!: Date; // Initialized by calling `this.setDate` in constructor.

  /**
   * Current draggable type.
   */
  @observable private draggableType?: "meal" | "dish";

  /**
   * Current draggable ID.
   */
  private draggableId?: string;

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
          <TrashCan isRemovable={this.isDraggableRemovable()} />

          <MealsView draggableType={this.draggableType} />
        </DragDropContext>

        <Plus fixed={true} onClick={this.handleAddClick}>
          +
        </Plus>
      </Container>
    );
  }

  /**
   * Returns whether current draggable is removable.
   */
  private isDraggableRemovable = () => {
    if (this.draggableType === undefined) {
      return false;
    }

    if (this.draggableType === "dish") {
      return true;
    }

    return this.props.meals!.withId(this.draggableId!)!.dishes.length === 0;
  };

  /**
   * Sets currently active date to specified date.
   */
  @action
  private setDate = async (date: Date) => {
    this.date = date;
    await this.props.meals!.getAll(date);
  };

  /**
   * Updates current draggable type on drag start.
   */
  @action
  private handleDragStart = (initial: DragStart) => {
    this.draggableType =
      initial.source.droppableId === "meals" ? "meal" : "dish";
    this.draggableId = initial.draggableId;
  };

  /**
   * Handles drag end event.
   */
  @action
  private handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    const type = this.draggableType;
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

    if (type === "meal") {
      const target = this.props.meals!.withId(draggableId)!;

      if (destination.droppableId === "trashCan") {
        this.props.meals!.delete(target);
      } else {
        this.props.meals!.insert(target, destination.index);
      }
    } else {
      const target = this.props
        .meals!.withId(source.droppableId)!
        .withId(draggableId)!;

      if (destination.droppableId === "trashCan") {
        this.props.meals!.deleteDish(target);
      } else {
        this.props.meals!.insertDish(
          target,
          this.props.meals!.withId(destination.droppableId)!,
          destination.index
        );
      }
    }
  };

  /**
   * Shows name selection scene when user clicks on `Plus` button.
   */
  @action
  private handleAddClick = () => {
    this.props.views!.push("center", "Name", {
      onSelect: this.handleNameSelect
    });
  };

  /**
   * Creates a new meal with specified name. Used as a callback function for
   * `Name` scene, that is used to select meal name.
   */
  @action
  private handleNameSelect = (name: string) => {
    this.props.meals!.create(name, this.date);
    this.props.views!.popUntil(this.props.scene);
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
