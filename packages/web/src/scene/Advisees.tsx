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
import { Button } from "../component/Button";
import { Collection } from "../component/Collection";
import { GroupList } from "../component/GroupList";
import { Head } from "../component/Head";
import { Account } from "../model/Account";
import { styled } from "../styling/theme";
import { Statistics } from "./Statistics";

/**
 * Advisee scene component translation.
 */
interface AdviseesTranslation {
  /**
   * Invite button text.
   */
  invite: string;

  /**
   * Page title and top bar title text.
   */
  title: string;
}

/**
 * Scene that is used by advisers to track and advise their advisees.
 */
@inject("accountStore", "groupStore", "viewStore")
@observer
export class Advisees extends SceneComponent<
  "Advisees",
  {},
  AdviseesTranslation
> {
  /**
   * Current draggable type.
   */
  @observable private draggableType?: "account" | "group";

  /**
   * Currently selected advisee account.
   */
  @observable private selectedAccount?: Account;

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
        <Head title={this.translation.title} />

        <Sidebar>
          <Overflow>
            <Bar>
              <Title>{this.translation.title}</Title>
              <Button onClick={this.handleInvite}>
                {this.translation.invite}
              </Button>
            </Bar>

            <DragDropContext
              onDragStart={this.handleDragStart}
              onDragEnd={this.handleDragEnd}
            >
              <Collection>
                {this.props.groupStore!.ungrouped.length > 0 && (
                  <AdviseeList
                    group={this.props.groupStore!.ungrouped}
                    onSelect={this.handleSelect}
                  />
                )}

                <GroupList
                  draggableType={this.draggableType}
                  groups={this.props.groupStore!.groups}
                  onSelect={this.handleSelect}
                />
              </Collection>
            </DragDropContext>
          </Overflow>

          <ActionAligner>
            <Action fixed={true} onClick={this.handleGroupAddition} />
          </ActionAligner>
        </Sidebar>

        {this.selectedAccount !== undefined && (
          <Statistics account={this.selectedAccount} />
        )}
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
   * Shows invitation creation scene on invite button click.
   */
  private handleInvite = () => {
    this.scene = this.props.viewStore!.push("center", "Invite", {
      onClose: this.handleClose
    });
  };

  /**
   * Shows group creation scene on group add button click.
   */
  private handleGroupAddition = () => {
    this.scene = this.props.viewStore!.push("center", "GroupEdit", {
      onClose: this.handleClose
    });
  };

  /**
   * Closes pushed `GroupEdit` or `Invite` scene.
   */
  private handleClose = () => {
    this.props.viewStore!.pop(this.scene!);
  };

  /**
   * Sets currently selected advisee account.
   */
  private handleSelect = (account: Account) => {
    this.selectedAccount = account;
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
 * Component with automatic y overflow.
 */
const Overflow = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

/**
 * Top bar component.
 */
const Bar = styled.div`
  position: sticky;
  top: 0;

  width: 100%;
  height: ${({ theme }) => theme.height};

  padding: 0 ${({ theme }) => theme.padding};
  box-sizing: border-box;

  display: flex;
  align-items: center;

  box-shadow: inset 0 -1px 0 0 ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Invitation creation title.
 */
const Title = styled.div`
  width: 100%;
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
