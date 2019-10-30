import * as React from "react";
import { Droppable } from "react-beautiful-dnd";

import { TranslatedComponent } from "../base/TranslatedComponent";
import { styled } from "../styling/theme";

/**
 * Trash can component props.
 */
interface TrashCanProps {
  /**
   * Whether current draggable is removable.
   */
  isRemovable: boolean;
}

/**
 * Trash can component translation.
 */
interface TrashCanTranslation {
  /**
   * Delete label translation.
   */
  delete: string;
}

/**
 * Component which renders a droppable that on drop deletes dropped component.
 */
export class TrashCan extends TranslatedComponent<
  "TrashCan",
  TrashCanProps,
  TrashCanTranslation
> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: TrashCanProps) {
    super("TrashCan", props);
  }

  /**
   * Renders the droppable component inside the container.
   */
  public render() {
    return (
      <Container isRemovable={this.props.isRemovable}>
        <Droppable
          droppableId="trashCan"
          isDropDisabled={!this.props.isRemovable}
        >
          {provided => (
            <Drop ref={provided.innerRef} {...provided.droppableProps}>
              {provided.placeholder}
              <Delete>Delete</Delete>
            </Drop>
          )}
        </Droppable>
      </Container>
    );
  }
}

/**
 * Container component props.
 */
interface ContainerProps {
  isRemovable: boolean;
}

/**
 * TrashCan container that wraps the droppable component.
 */
const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 0;
  z-index: 3;

  overflow: hidden;

  width: 100%;
  max-height: ${({ isRemovable }) => (isRemovable ? "100%" : "0")};

  box-shadow: inset 0 -2px 0 0 ${({ theme }) => theme.colorInvalid};
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.backgroundColor};

  transition: ${({ theme }) => theme.transitionSlow};

  pointer-events: none;
`;

/**
 * Droppable component into which draggables are dropped.
 */
const Drop = styled.div`
  position: relative;

  max-width: ${({ theme }) => theme.widthMedium};
  width: 100%;

  margin: 0 auto;
  padding: ${({ theme }) => theme.heightHalf} ${({ theme }) => theme.padding};
  box-sizing: border-box;
`;

/**
 * Delete label component.
 */
const Delete = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  color: ${({ theme }) => theme.colorInvalid};
`;
