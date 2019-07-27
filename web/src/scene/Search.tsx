import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { TextField } from "../component/TextField";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Scene which is used for selecting a food item by searching it by its name.
 */
@inject("foods", "views")
@observer
export class Search extends Scene<"Search"> {
  /**
   * Search query string.
   */
  @observable private query = "";

  /**
   * Renders search bar and search results.
   */
  public render() {
    return (
      <>
        <Controls>
          <TextField
            name="query"
            value={this.query}
            onChange={this.handleChange}
            type="search"
          />
        </Controls>
        <Results>
          {this.props.foods!.getAll().map(food => (
            <Result key={food.id} onClick={this.handleClick} value={food.id}>
              {food.name}
            </Result>
          ))}
        </Results>
      </>
    );
  }

  /**
   * Updates query value when text field input changes.
   */
  @action
  private handleChange = (name: "query", value: string) => {
    this[name] = value;

    if (value.trim() !== "") {
      this.props.foods!.search(value.trim());
    } else {
      this.props.foods!.clear();
    }
  };

  /**
   * Shows food item editing scene on the side when user clicks on food item
   * result.
   */
  @action
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    this.props.views!.aside("Edit", {
      food: this.props.foods!.get(event.currentTarget.value)
    });
  };
}

const Controls = styled.div`
  position: sticky;
  top: 0;

  padding: calc(${({ theme }) => theme.PADDING} / 3)
    ${({ theme }) => theme.PADDING};
  box-sizing: border-box;

  border-bottom: solid 1px ${({ theme }) => theme.BORDER_COLOR};

  background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
`;

const Results = styled.div`
  padding: ${({ theme }) => theme.PADDING};
  box-sizing: border-box;

  flex: 1 1 auto;

  display: inline-grid;
  gap: calc(${({ theme }) => theme.PADDING} / 3);
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(4 * ${({ theme }) => theme.HEIGHT}), 1fr)
  );
  grid-template-rows: max-content;
`;

const Result = styled.button`
  ${RESET};

  height: calc(4 * ${({ theme }) => theme.HEIGHT});

  border: solid 1px ${({ theme }) => theme.BORDER_COLOR};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS};
  box-sizing: border-box;

  cursor: pointer;
`;
