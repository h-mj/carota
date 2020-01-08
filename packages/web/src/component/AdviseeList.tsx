import { observer } from "mobx-react";
import * as React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import { Component } from "../base/Component";
import { Account } from "../model/Account";
import { Group } from "../model/Group";
import { AdviseeView } from "./AdviseeView";

/**
 * Advisee list component props.
 */
interface AdviseeListProps {
  /**
   * Advisee group of list of advisees.
   */
  group: Group | Account[];
}

/**
 * Component that displays a list of advisees.
 */
@observer
export class AdviseeList extends Component<AdviseeListProps> {
  /**
   * Renders a list of `AdviseeView` components for each provided advisee.
   */
  public render() {
    const id = Array.isArray(this.props.group)
      ? "ungrouped"
      : this.props.group.id;

    const advisees = Array.isArray(this.props.group)
      ? this.props.group
      : this.props.group.accounts;

    return (
      <Droppable
        droppableId={id}
        isDropDisabled={Array.isArray(this.props.group)}
      >
        {provided => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {advisees.map((advisee, index) => (
              <AdviseeView key={advisee.id} advisee={advisee} index={index} />
            ))}

            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
  }
}

/**
 * Component that contains all `AdviseeView` components.
 */
const Container = styled.div`
  min-height: ${({ theme }) => theme.height};
`;
