import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Stage } from "./Stage";
import { Scene } from "./Scene";
import { InputChangeHandler } from "../component/Input/Input";
import { TextField } from "../component/Input/TextField";
import { UNIT_HEIGHT, BORDER_RADIUS } from "../styling/sizes";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

@inject("foods", "views")
@observer
export class FoodSearch extends Scene<"FoodSearch"> {
  @observable query = "";

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
              <Result key={food.id} onClick={this.handleClick}>
                {food.name}
              </Result>
            ))}
          </Results>
        )}
      </>
    );
  }

  @action
  private handleChange: InputChangeHandler<string> = (_, value) => {
    this.query = value;

    if (value) {
      this.props.foods!.search({ query: this.query });
    } else {
      this.props.foods!.clear();
    }
  };

  @action
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    this.props.views!.aside(new Stage("FoodEdit", undefined, {}));
  };
}

const Results = styled.div`
  width: 100%;

  margin-top: ${UNIT_HEIGHT / 4}rem;

  color: ${({ theme }) => theme.borderColor};
  box-shadow: 0 0 0 1px inset 0 0 0 1px;
  border-radius: ${BORDER_RADIUS};
`;

const Result = styled.button`
  ${RESET};

  display: flex;
  align-items: center;

  width: 100%;
  height: ${UNIT_HEIGHT}rem;

  padding: 0 ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;

  color: ${({ theme }) => theme.borderColor};
  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: ${BORDER_RADIUS}rem;

  &:last-of-type {
    border-bottom: 0;
  }
`;
