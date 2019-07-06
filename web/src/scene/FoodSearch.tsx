import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Scene } from "./Scene";
import { InputChangeHandler } from "../component/Input/Input";
import { TextField } from "../component/Input/TextField";
import { Medium } from "../component/container/Medium";
import { LIGHT } from "../styling/light";
import { UNIT_HEIGHT, BORDER_RADIUS } from "../styling/sizes";

@inject("foods")
@observer
export class FoodSearch extends Scene<"FoodSearch"> {
  @observable query = "";

  public render() {
    const results = this.props.foods!.getAll();

    return (
      <Medium>
        <TextField
          name="query"
          onChange={this.handleChange}
          type="text"
          value={this.query}
        />

        {results.length > 0 && (
          <Results>
            {this.props.foods!.getAll().map(food => (
              <Result key={food.id}>{food.name}</Result>
            ))}
          </Results>
        )}
      </Medium>
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
}

const Results = styled.div`
  width: 100%;

  margin-top: ${UNIT_HEIGHT / 4}rem;

  color: ${LIGHT.default.borderColor};
  box-shadow: 0 0 0 1px inset 0 0 0 1px;
  border-radius: ${BORDER_RADIUS};
`;

const Result = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: ${UNIT_HEIGHT}rem;

  padding: 0 ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;

  color: ${LIGHT.default.borderColor};
  box-shadow: 0 0 0 1px, inset 0 0 0 1px;
  border-radius: ${BORDER_RADIUS}rem;

  &:last-of-type {
    border-bottom: 0;
  }
`;
