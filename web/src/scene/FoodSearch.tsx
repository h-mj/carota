import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { SceneContext } from "./SceneContext";
import { Scene } from "./Scene";
import { TextField } from "../component/TextField";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

@inject("foods", "views")
@observer
export class FoodSearch extends Scene<"FoodSearch"> {
  @observable private query = "";

  public render() {
    const results = this.props.foods!.getAll();

    return (
      <>
        <TextField
          name="query"
          onChange={this.handleChange}
          type="text"
          value={this.query}
        />

        {results.length > 0 && (
          <Results>
            {this.props.foods!.getAll().map(food => (
              <Result key={food.id} onClick={this.handleClick} value={food.id}>
                {food.name}
              </Result>
            ))}
          </Results>
        )}
      </>
    );
  }

  @action
  private handleChange = (_: string, value: string) => {
    this.query = value;

    if (value) {
      this.props.foods!.search({ query: this.query });
    } else {
      this.props.foods!.clear();
    }
  };

  @action
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    this.props.views!.aside(
      new SceneContext("FoodEdit", undefined, {
        food: this.props.foods!.get(event.currentTarget.value)
      })
    );
  };
}

const Results = styled.div`
  width: 100%;

  margin-top: calc(${({ theme }) => theme.PADDING} / 3);

  color: ${({ theme }) => theme.BORDER_COLOR};
  box-shadow: 0 0 0 1px inset 0 0 0 1px;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS};
`;

const Result = styled.button`
  ${RESET};

  display: flex;
  align-items: center;

  width: 100%;
  height: ${({ theme }) => theme.HEIGHT}rem;

  padding: 0 calc(${({ theme }) => theme.PADDING} / 3);
  box-sizing: border-box;

  color: ${({ theme }) => theme.BORDER_COLOR};
  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: ${({ theme }) => theme.BORDER_RADIUS};

  &:last-of-type {
    border-bottom: 0;
  }
`;
