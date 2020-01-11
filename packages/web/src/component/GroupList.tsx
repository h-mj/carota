import { observer } from "mobx-react";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { Group } from "../model/Group";
import { styled } from "../styling/theme";
import { GroupView } from "./GroupView";

/**
 * Group list component props.
 */
interface GroupListProps {
  /**
   * Current draggable type.
   */
  draggableType?: "account" | "group";

  /**
   * List of advisee groups.
   */
  groups: Group[];
}

/**
 * Component that displays a list of groups.
 */
@observer
export class GroupList extends Component<GroupListProps> {
  /**
   * Renders all provided ungrouped advisee accounts alongside all advisee
   * groups.
   */
  public render() {
    const groups = [...this.props.groups];

    return (
      <Droppable
        droppableId="groups"
        isDropDisabled={this.props.draggableType !== "group"}
      >
        {provided => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {groups.map((group, index) => (
              <GroupView
                key={group.id}
                draggableType={this.props.draggableType}
                index={index}
                group={group}
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
 * Container component that contains all `GroupView` components.
 */
const Container = styled.div`
  & > * {
    margin-bottom: ${({ theme }) => theme.padding};
  }
`;
