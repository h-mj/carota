import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Medium } from "../component/container/Medium";
import styled from "styled-components";
import { TextField } from "../component/TextField";
import { InputChangeHandler } from "../component/Input";
import { UNIT } from "../styling/sizes";
import { DEFAULT_BORDER } from "../styling/colors";

@inject("foods")
@observer
export class FoodList extends Scene<"FoodList"> {
  @observable query = "";

  public render() {
    return (
      <Medium>
        <TextField
          name="query"
          onChange={this.handleChange}
          placeholder="Search"
          type="text"
          value={this.query}
        />

        {this.props.foods!.getAll().map(food => (
          <Result>{food.name}</Result>
        ))}
      </Medium>
    );
  }

  @action
  private handleChange: InputChangeHandler<string> = (_, value) => {
    this.query = value;

    if (value) {
      this.props.foods!.find({ query: this.query });
    } else {
      this.props.foods!.clear();
    }
  };
}

const Result = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: ${UNIT}rem;

  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  border-bottom: solid 2px ${DEFAULT_BORDER};

  &:last-of-type {
    border-bottom: 0;
  }
`;
