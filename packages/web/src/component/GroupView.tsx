import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Scenes } from "../base/Scene";
import { TranslatedComponent } from "../base/TranslatedComponent";
import { Group } from "../model/Group";
import { styled } from "../styling/theme";
import { AdviseeList } from "./AdviseeList";
import { EditButton } from "./EditButton";

/**
 * Group view component props.
 */
interface GroupViewProps {
  /**
   * Current draggable type.
   */
  draggableType?: "account" | "group";

  /**
   * Advisee group which will be rendered.
   */
  group: Group;

  /**
   * Group index within the advisee group list.
   */
  index: number;
}

/**
 * Group view component translation.
 */
interface GroupViewTranslation {
  /**
   * Ungrouped advisee account group title.
   */
  ungrouped: string;
}

/**
 * Component that displays specified group.
 */
@inject("viewStore")
@observer
export class GroupView extends TranslatedComponent<
  "GroupView",
  GroupViewProps,
  GroupViewTranslation
> {
  /**
   * Pushed `GroupEdit` scene instance.
   */
  private scene?: Scenes;

  /**
   * Creates a new instance of `GroupView` and sets the name of this component.
   */
  public constructor(props: GroupViewProps) {
    super("GroupView", props);
  }

  /**
   * Renders the group view component alongside a list of advisees component.
   */
  public render() {
    const { name } = this.props.group;

    return (
      <Draggable draggableId={this.props.group.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
          >
            <Header {...provided.dragHandleProps}>
              {name}
              <EditButton onClick={this.handleEdit} />
            </Header>

            <AdviseeList
              draggableType={this.props.draggableType}
              group={this.props.group}
            />
          </Container>
        )}
      </Draggable>
    );
  }

  /**
   * Shows group editing scene on edit button click.
   */
  private handleEdit = () => {
    this.scene = this.props.viewStore!.push("center", "GroupEdit", {
      group: this.props.group,
      onClose: this.handleEditClose
    });
  };

  /**
   * Closes pushed `GroupEdit` scene.
   */
  private handleEditClose = () => {
    this.props.viewStore!.pop(this.scene!);
  };
}

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether the container is being dragged.
   */
  isDragging: boolean;
}

/**
 * Group information container component.
 */
const Container = styled.div<ContainerProps>`
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ isDragging, theme }) =>
    isDragging
      ? `0 0 0 2px ${theme.colorActive}`
      : `0 0 0 1px ${theme.borderColor}`};
  background-color: ${({ theme }) => theme.backgroundColor};
  transition: box-shadow ${({ theme }) => theme.transition};
  overflow: hidden;
`;

/**
 * Group header component.
 */
const Header = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  padding: 0 ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;

  box-shadow: inset 0 -1px 0 0 ${({ theme }) => theme.borderColor};

  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.colorPrimary};
`;
