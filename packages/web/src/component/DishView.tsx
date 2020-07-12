import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";
import { Dish } from "../model/Dish";
import { styled } from "../styling/theme";
import { CheckBox } from "./CheckBox";
import { EditButton } from "./EditButton";
import { ItemHeader, ItemHeaderText, ItemHeaderTexts } from "./ItemHeader";
import { NutrientQuantities } from "./NutrientQuantities";

/**
 * Dish view component props.
 */
interface DishViewProps {
  /**
   * Dish model which information is being displayed.
   */
  dish: Dish;

  /**
   * Dish entry index within the list.
   */
  index: number;
}

/**
 * Component that display information about specified dish.
 */
@inject("mealStore", "viewStore")
@observer
export class DishView extends Component<DishViewProps> {
  /**
   * Spam prevention timeout that sets final eaten status after some time.
   */
  private timeoutId = 0;

  /**
   * Pushed quantity selection scene reference.
   */
  private scene?: Scenes;

  /**
   * Renders the dish entry with all its information.
   */
  public render() {
    const { dish } = this.props;
    const { eaten, quantity } = dish;

    return (
      <Draggable draggableId={dish.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            eaten={eaten}
            isDragging={snapshot.isDragging}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <ItemHeaderTexts>
              <CheckBox
                name="eaten"
                value={eaten}
                basic={true}
                onChange={this.handleCheckBoxChange}
              />

              <Quantity>
                {quantity}
                {this.props.viewStore!.translation.units[dish.foodstuff.unit]}
              </Quantity>

              <ItemHeaderText>{dish.foodstuff.name}</ItemHeaderText>

              <EditButton onClick={this.handleEditClick} />
            </ItemHeaderTexts>

            <NutrientQuantities model={dish} />
          </Container>
        )}
      </Draggable>
    );
  }

  /**
   * Sets dish eaten value to opposite to current value.
   */
  @action
  private handleCheckBoxChange = async () => {
    window.clearTimeout(this.timeoutId);

    this.props.dish.eaten = !this.props.dish.eaten;
    this.timeoutId = window.setTimeout(this.updateEatenStatus, 1000);
  };

  /**
   * Updates provided dish eaten status after some timeout.
   */
  @action
  private updateEatenStatus = () => {
    this.props.dish.setEaten(this.props.dish.eaten);
  };

  /**
   * Shows quantity selection scene on edit button click.
   */
  @action
  private handleEditClick = () => {
    this.scene = this.props.viewStore!.push("center", "DishEdit", {
      dish: this.props.dish!,
      foodstuff: this.props.dish!.foodstuff,
      meal: this.props.dish!.meal,
      onClose: this.handleClose,
    });
  };

  /**
   * Closes pushed `DishEdit` scene.
   */
  private handleClose = () => {
    this.props.viewStore!.pop(this.scene!);
  };
}

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether dish has been eaten.
   */
  eaten: boolean;

  /**
   * Whether dish is being dragged.
   */
  isDragging: boolean;
}

/**
 * Dish entry component container.
 */
const Container = styled(ItemHeader)<ContainerProps>`
  box-shadow: ${({ isDragging, theme }) =>
    isDragging
      ? `inset 0 0 0 2px ${theme.colorActive}`
      : `inset 0 1px 0 0 ${theme.borderColor}, 0 1px 0 0 ${theme.borderColor}`};

  border-radius: ${({ isDragging, theme }) =>
    isDragging ? theme.borderRadius : "0"};
  background-color: ${({ eaten, theme }) =>
    eaten ? theme.backgroundColor : theme.backgroundColorDisabled};

  transition: box-shadow ${({ theme }) => theme.transition},
    border-radius ${({ theme }) => theme.transition};
`;

/**
 * Component that displays dish quantity.
 */
const Quantity = styled(ItemHeaderText)`
  min-width: ${({ theme }) => theme.height};

  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: center;

  color: ${({ theme }) => theme.colorSecondary};
  text-align: center;
`;
