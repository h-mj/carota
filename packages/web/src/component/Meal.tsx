import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Component } from "../base/Component";
import { FoodstuffModel } from "../model/FoodstuffModel";
import { MealModel } from "../model/MealModel";
import { styled } from "../styling/theme";
import { Consumable } from "./Consumable";
import { Plus } from "./Plus";

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
@inject("meals", "views")
@observer
export class Meal extends Component<MealProps> {
  public render() {
    const { meal } = this.props;

    return (
      <Draggable draggableId={meal.id} index={this.props.index}>
        {({ draggableProps, innerRef, dragHandleProps }) => (
          <Container ref={innerRef} {...draggableProps}>
            <Title {...dragHandleProps}>{meal.name}</Title>
            {meal.consumables.map(consumable => (
              <Consumable key={consumable.id}>
                {consumable.quantity}
                {consumable.foodstuff.unit} {consumable.foodstuff.name}
              </Consumable>
            ))}

            <PlusContainer>
              <Plus onClick={this.showSearch}>+</Plus>
            </PlusContainer>
          </Container>
        )}
      </Draggable>
    );
  }

  public showSearch = () => {
    this.props.views!.push("main", "Search", { select: this.select });
  };

  /**
   * Callback function which is called when user selects foodstuff and its
   * quantity.
   */
  @action
  private select = (foodstuff: FoodstuffModel, quantity: number) => {
    this.props.meals!.addConsumable(this.props.meal, foodstuff, quantity);
    this.props.views!.refresh();
  };
}

/**
 * Container component that wraps all other components.
 */
const Container = styled.div`
  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

/**
 * Meal title bar.
 */
const Title = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  display: flex;
  align-items: center;

  padding: 0 ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;
`;

const PlusContainer = styled.div`
  width: 100%;
  height: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;
