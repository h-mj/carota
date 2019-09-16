import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Food } from "../component/Food";
import { TextField } from "../component/TextField";
import { FoodModel } from "../model/FoodModel";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Query string validator.
 */
const validate = deviate<string>()
  .trim()
  .notEmpty();

/**
 * Scene which is used for selecting a food item by searching it by its name.
 */
@inject("foods", "views")
@observer
export class Search extends SceneComponent<"Search"> {
  /**
   * Search query string.
   */
  @observable private query = "";

  /**
   * ID of a timeout after which search request is made. Used to limit search
   * requests when user is still typing.
   */
  private timeoutId: number | undefined;

  /**
   * Whether or not search is successfully completed.
   */
  @observable private completed = false;

  /**
   * Sets the name of this scene.
   */
  public constructor(props: DefaultSceneComponentProps<"Search">) {
    super("Search", props);
  }

  /**
   * Renders search bar and search results.
   */
  public render() {
    return (
      <>
        <Controls>
          <TextField
            autoFocus={true}
            name="query"
            value={this.query}
            onChange={this.handleChange}
            type="search"
          />
        </Controls>
        {this.completed && (
          <Results>
            {this.props.foods!.getAll().map(food => (
              <Food key={food.id} food={food} select={this.select} />
            ))}
            <Add onClick={this.showEditor}>+</Add>
          </Results>
        )}
      </>
    );
  }

  /**
   * Updates query value and sets or overrides a timeout after which search
   * request is made.
   */
  @action
  private handleChange = (name: "query", value: string) => {
    this[name] = value;

    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(this.search, 500);
    this.completed = false;
  };

  /**
   * Makes a search request if query is valid.
   */
  @action
  private search = async () => {
    const result = validate(this.query);

    if (result.ok) {
      await this.props.foods!.search(result.value);
    } else {
      this.props.foods!.clear();
    }

    this.completed = result.ok;
    this.timeoutId = undefined;
  };

  /**
   * Shows food editor when user clicks on add result.
   */
  @action
  private showEditor = () => {
    this.props.views!.push("left", "Edit", {});
  };

  /**
   * Callback function which is called when user clicks on a product and selects
   * its quantity in opened `Quantity` scene.
   */
  @action
  private select = (food: FoodModel, quantity: number) => {
    console.log(`Selected ${quantity}${food.unit} of ${food.name}`);
    this.props.views!.refresh(); // Refresh the page.
  };
}

/**
 * Component that wraps search controls which include the search bar.
 */
const Controls = styled.div`
  position: sticky;
  top: 0;

  padding: calc(${({ theme }) => theme.padding} / 3)
    ${({ theme }) => theme.padding};
  box-sizing: border-box;

  border-bottom: solid 1px ${({ theme }) => theme.borderColor};

  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Grid that contains all food information components of found food items.
 */
const Results = styled.div`
  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  display: grid;
  gap: calc(${({ theme }) => theme.padding} / 3);
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(${({ theme }) => theme.formWidth} / 2), 1fr)
  );
  grid-template-rows: min-content;
`;

/**
 * Button that on click opens food creation scene.
 */
const Add = styled.button`
  ${RESET};

  min-height: 11.5rem;

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.orange};
  font-size: 3.5rem;

  cursor: pointer;
`;
