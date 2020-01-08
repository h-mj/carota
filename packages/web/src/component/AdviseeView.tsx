import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Sex } from "server";

import { TranslatedComponent } from "../base/TranslatedComponent";
import { Account } from "../model/Account";
import { styled } from "../styling/theme";

/**
 * Advisee view component props.
 */
interface AdviseeViewProps {
  /**
   * Advisee account model.
   */
  advisee: Account;

  /**
   * Advisee index within the advisee list.
   */
  index: number;
}

/**
 * Advisee view component translation.
 */
interface AdviseeViewTranslation {
  /**
   * Sex abbreviations.
   */
  abbreviations: Record<Sex, string>;
}

/**
 * Component that displays the information of a single advisee account.
 */
@inject("views")
@observer
export class AdviseeView extends TranslatedComponent<
  "AdviseeView",
  AdviseeViewProps,
  AdviseeViewTranslation
> {
  /**
   * Creates a new instance of `AdviseeView` and sets the name of this component.
   */
  public constructor(props: AdviseeViewProps) {
    super("AdviseeView", props);
  }

  /**
   * Renders information of specified advisee account.
   */
  public render() {
    return (
      <Draggable draggableId={this.props.advisee.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Name>{this.props.advisee.name}</Name>
            <Attribute>
              {this.translation.abbreviations[this.props.advisee.sex]}
            </Attribute>
            <Attribute>{30}</Attribute>
          </Container>
        )}
      </Draggable>
    );
  }
}

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether this component is currently being dragged.
   */
  isDragging: boolean;
}

/**
 * Advisee information container component.
 */
const Container = styled.div<ContainerProps>`
  width: 100%;
  height: ${({ theme }) => theme.height};

  padding: 0 ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.backgroundColor};
  border-radius: ${({ isDragging, theme }) =>
    isDragging ? theme.borderRadius : 0};

  transition: box-shadow ${({ theme }) => theme.transition},
    border-radius ${({ theme }) => theme.transition};

  ${({ isDragging, theme }) =>
    isDragging && `box-shadow: inset 0 0 0 2px ${theme.colorActive}`};
`;

/**
 * Advisee name container.
 */
const Name = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colorPrimary};
`;

/**
 * Advisee attribute container.
 */
const Attribute = styled.div`
  width: ${({ theme }) => theme.heightHalf};
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colorSecondary};
`;
