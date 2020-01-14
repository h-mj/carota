import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DragDropContext, DragStart, DropResult } from "react-beautiful-dnd";

import { Scenes } from "../base/Scene";
import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Action } from "../component/Action";
import { AdviseeList } from "../component/AdviseeList";
import { GroupList } from "../component/GroupList";
import { styled } from "../styling/theme";

/**
 * Scene that is used by advisers to track and advise their advisees.
 */
@inject("accountStore", "groupStore", "viewStore")
@observer
export class Advisees extends SceneComponent<"Advisees"> {
  /**
   * Current draggable type.
   */
  @observable private draggableType?: "account" | "group";

  /**
   * Pushed `GroupEdit` scene reference.
   */
  private scene?: Scenes;

  /**
   * Creates a new instance of `Advisees` and sets the name of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Advisees">) {
    super("Advisees", props);

    if (this.props.accountStore!.current!.type !== "Adviser") {
      this.props.viewStore!.unknown(); // Show 404 if account is not an adviser.
      return;
    }
  }

  /**
   * Renders the list of advisees and statistics of currently selected advisee.
   */
  public render() {
    return (
      <Container>
        <Sidebar>
          <PaddedContent>
            <DragDropContext
              onDragStart={this.handleDragStart}
              onDragEnd={this.handleDragEnd}
            >
              {this.props.groupStore!.ungrouped.length > 0 && (
                <AdviseeList group={this.props.groupStore!.ungrouped} />
              )}

              <GroupList
                draggableType={this.draggableType}
                groups={this.props.groupStore!.groups}
              />
            </DragDropContext>
          </PaddedContent>

          <ActionAligner>
            <Action fixed={true} onClick={this.handleAction} />
          </ActionAligner>
        </Sidebar>

        <PaddedContent>Statistics</PaddedContent>
      </Container>
    );
  }

  /**
   * Updates current draggable type on drag start.
   */
  private handleDragStart = (initial: DragStart) => {
    this.draggableType =
      initial.source.droppableId === "groups" ? "group" : "account";
  };

  /**
   * Handles drag end result.
   */
  private handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (this.draggableType === "group") {
      const group = this.props.groupStore!.withId(draggableId);

      if (group === undefined) {
        return;
      }

      group.insert(destination.index);

      return;
    }

    const account = this.props.accountStore!.withId(draggableId);
    const group = this.props.groupStore!.withId(destination.droppableId);

    if (account === undefined || group === undefined) {
      return;
    }

    account.insert(group, destination.index);

    const { ungrouped } = this.props.groupStore!;

    if (ungrouped.includes(account)) {
      ungrouped.splice(ungrouped.indexOf(account), 1);
    }
  };

  /**
   * Shows group creation scene on group add button click.
   */
  private handleAction = () => {
    this.scene = this.props.viewStore!.push("center", "GroupEdit", {
      onClose: this.handleClose
    });
  };

  /**
   * Closes `GroupEdit` scene.
   */
  private handleClose = () => {
    this.props.viewStore!.pop(this.scene!);
  };
}

/**
 * Advisees scene container component.
 */
const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  overflow: hidden;
`;

/**
 * Sidebar container.
 */
const Sidebar = styled.div`
  position: relative;

  width: ${({ theme }) => theme.widthSmall};
  height: 100%;
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.backgroundColor};
  border-right: solid 1px ${({ theme }) => theme.borderColor};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    width: 100%;
    border-right: none;
  }
`;

/**
 * Component that pads out its children with theme defined padding. Bottom
 * padding is much larger to allow user to scroll last element up so that menu
 * and add group buttons do not overlap it.
 */
const PaddedContent = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;

  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  & > *:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.padding};
  }

  & > *:last-child {
    margin-bottom: calc(2 * ${({ theme }) => theme.height});
  }
`;

/**
 * Aligns the `Action` component in correct place.
 */
const ActionAligner = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  transform: translateZ(0);

  width: 100%;
  height: 100%;

  pointer-events: none;

  & > * {
    pointer-events: initial;
  }
`;
