import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Medium } from "../component/container/Medium";
import styled from "styled-components";
import { TextField } from "../component/TextField";
import { InputChangeHandler } from "../component/Input";
import { UNIT, BORDER_RADIUS } from "../styling/sizes";
import { DEFAULT_BORDER } from "../styling/colors";

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
          placeholder="Search"
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

  margin-top: ${UNIT / 4}rem;

  box-shadow: 0 0 0 1px ${DEFAULT_BORDER}, inset 0 0 0 1px ${DEFAULT_BORDER};
  border-radius: ${BORDER_RADIUS}rem;
`;

const Result = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: ${UNIT}rem;

  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  box-shadow: 0 0 0 1px ${DEFAULT_BORDER}, inset 0 0 0 1px ${DEFAULT_BORDER};
  border-radius: ${BORDER_RADIUS}rem;

  &:last-of-type {
    border-bottom: 0;
  }
`;
