import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";
import { Dish } from "../model/Dish";
import { Foodstuff } from "../model/Foodstuff";
import { styled } from "../styling/theme";
import { CheckBox } from "./CheckBox";
import { Edit } from "./Edit";
import { ItemHeader } from "./ItemHeader";
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
@inject("meals", "views")
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
            <ItemHeader>
              <CheckBox
                name="eaten"
                value={eaten}
                basic={true}
                onChange={this.handleCheckBoxChange}
              />

              <Quantity>
                {quantity}
                {dish.foodstuff.unit}
                <Edit onClick={this.handleEditClick} />
              </Quantity>

              <span>{dish.foodstuff.name}</span>
            </ItemHeader>

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
  private updateEatenStatus = async () => {
    await this.props.meals!.setDishEaten(
      this.props.dish,
      this.props.dish.eaten
    );
  };

  /**
   * Shows quantity selection scene on edit button click.
   */
  @action
  private handleEditClick = () => {
    this.scene = this.props.views!.push("center", "Quantity", {
      foodstuff: this.props.dish!.foodstuff,
      quantity: this.props.dish!.quantity,
      select: this.handleSelect
    });
  };

  /**
   * Updates provided dish' quantity on quantity selection.
   */
  private handleSelect = (_: Foodstuff, quantity: number) => {
    this.props.views!.pop(this.scene!);
    this.props.dish!.setQuantity(quantity);
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
const Container = styled.div<ContainerProps>`
  width: 100%;

  display: flex;

  box-shadow: ${({ isDragging, theme }) =>
    isDragging
      ? `0 0 0 1px ${theme.colorOrange}`
      : `0 1px 0 0 ${theme.borderColor}`};

  border: solid 1px;
  border-color: ${({ isDragging, theme }) =>
    isDragging ? theme.colorOrange : "transparent"};
  border-top-color: ${({ isDragging, theme }) =>
    isDragging ? theme.colorOrange : theme.borderColor};
  border-radius: ${({ isDragging, theme }) =>
    isDragging ? theme.borderRadius : "0"};
  box-sizing: border-box;

  background-color: ${({ eaten, theme }) =>
    eaten ? theme.backgroundColor : theme.backgroundColorDisabled};

  transition: box-shadow ${({ theme }) => theme.transition},
    border-radius ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    flex-direction: column;
  }
`;

/**
 * Component that displays dish quantity.
 */
const Quantity = styled.span`
  min-width: calc(1.25 * ${({ theme }) => theme.height});

  display: flex;
  flex-shrink: 0;
  justify-content: space-between;

  color: ${({ theme }) => theme.colorSecondary};
  text-align: center;
`;
