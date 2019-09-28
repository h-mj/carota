import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { MealModel } from "../model/MealModel";
import { styled } from "../styling/theme";

/**
 * Meal component props.
 */
interface MealProps {
  /**
   * Meal index.
   */
  index: number;

  /**
   * Corresponding meal model instance.
   */
  meal: MealModel;
}

/**
 * Component that displays the information of a meal model.
 */
export class Meal extends Component<MealProps> {
  public render() {
    return (
      <Draggable draggableId={this.props.meal.id} index={this.props.index}>
        {({ draggableProps, placeholder, innerRef, dragHandleProps }) => (
          <Container ref={innerRef} {...draggableProps}>
            <Title {...dragHandleProps}>{this.props.meal.name}</Title>
            {placeholder}
          </Container>
        )}
      </Draggable>
    );
  }
}

const Container = styled.div`
  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  height: 20rem;
`;

const Title = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};
`;
