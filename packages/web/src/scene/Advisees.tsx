import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Action } from "../component/Action";
import { GroupList } from "../component/GroupList";
import { Sidebar } from "../component/Sidebar";
import { Account } from "../model/Account";
import { Group } from "../model/Group";
import { styled } from "../styling/theme";

/**
 * Scene that is used by advisers to track and advise their advisees.
 */
@inject("accounts", "groups", "views")
@observer
export class Advisees extends SceneComponent<"Advisees"> {
  /**
   * Array of ungrouped accounts.
   */
  @observable private ungrouped: Account[] = [];

  /**
   * Array of advisee account groups.
   */
  @observable private groupList: Group[] = [];

  /**
   * Creates a new instance of `Advisees` and sets the name of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Advisees">) {
    super("Advisees", props);

    if (this.props.accounts!.current!.type !== "Adviser") {
      this.props.views!.unknown(); // Show 404 if account is not an adviser.
      return;
    }

    this.load();
  }

  /**
   * Renders the list of advisees and statistics of currently selected advisee.
   */
  public render() {
    return (
      <Container>
        <Sidebar>
          <DragDropContext onDragEnd={this.handleDragEnd}>
            <GroupList ungrouped={this.ungrouped} groupList={this.groupList} />
          </DragDropContext>

          <Action fixed={true} />
        </Sidebar>

        <Main>Statistics</Main>
      </Container>
    );
  }

  /**
   * Loads advisee groups of current account.
   */
  private async load() {
    const { ungrouped, groups } = await this.props.groups!.get(
      this.props.accounts!.current!
    );

    this.ungrouped = ungrouped;
    this.groupList = groups;
  }

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

    const account = this.props.accounts!.withId(draggableId);
    const group = this.props.groups!.withId(destination.droppableId);

    if (account === undefined || group === undefined) {
      return;
    }

    account.insert(group, destination.index);

    if (this.ungrouped.includes(account)) {
      this.ungrouped.splice(this.ungrouped.indexOf(account), 1);
    }
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
 * Scene main content container component.
 */
const Main = styled.div`
  width: 100%;
  overflow-y: auto;
`;
