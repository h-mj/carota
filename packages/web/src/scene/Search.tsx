import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Scenes } from "../base/Scene";
import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { FoodstuffView } from "../component/FoodstuffView";
import { Plus } from "../component/Plus";
import { SceneTitle } from "../component/SceneTitle";
import { TextField } from "../component/TextField";
import { Foodstuff } from "../model/Foodstuff";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Query string validator.
 */
const validate = deviate<string>()
  .trim()
  .minLength(3);

/**
 * Search scene component props.
 */
interface SearchProps {
  /**
   * Foodstuff select callback function.
   */
  select: (foodstuff: Foodstuff, quantity: number) => void;
}

/**
 * Search scene component translation.
 */
interface SearchTranslation {
  /**
   * Search scene title translation.
   */
  title: string;
}

/**
 * Scene which is used for selecting a foodstuff by searching for it by its
 * name.
 */
@inject("foodstuffs", "views")
@observer
export class Search extends SceneComponent<
  "Search",
  SearchProps,
  SearchTranslation
> {
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
   * Pushed scanner scene reference.
   */
  private scanner?: Scenes;

  /**
   * Sets the name of this scene.
   */
  public constructor(
    props: SearchProps & DefaultSceneComponentProps<"Search">
  ) {
    super("Search", props);
  }

  /**
   * Renders search bar and search results.
   */
  public render() {
    return (
      <>
        <SceneTitle scene={this.props.scene} title={this.translation.title} />

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
          <AutoOverflow>
            <Results>
              {this.props.foodstuffs!.foodstuffs.map(foodstuff => (
                <FoodstuffView
                  key={foodstuff.id}
                  foodstuff={foodstuff}
                  onSelect={this.handleSelect}
                />
              ))}
              <Add onClick={this.showEditor}>+</Add>
            </Results>
          </AutoOverflow>
        )}

        <Plus fixed={true} onClick={this.showScanner} />
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
      await this.props.foodstuffs!.search(result.value);
    } else {
      this.props.foodstuffs!.clear();
    }

    this.completed = result.ok;
    this.timeoutId = undefined;
  };

  /**
   * Shows food editor when user clicks on add result.
   */
  @action
  private showEditor = () => {
    this.props.views!.push("left", "Edit", { name: this.query });
  };

  /**
   * Shows the scanner on scan button press.
   */
  @action
  private showScanner = () => {
    this.scanner = this.props.views!.push("main", "Scanner", {
      onScan: this.handleScan
    });
  };

  /**
   * Scanning callback function.
   */
  @action
  private handleScan = async (barcode?: string) => {
    this.props.views!.pop(this.scanner!);

    if (barcode === undefined) {
      return alert("Scanning failed");
    }

    const foodstuff = await this.props.views!.load(
      this.props.foodstuffs!.findByBarcode(barcode)
    );

    if (foodstuff === undefined) {
      return alert("Not found");
    }

    this.handleSelect(foodstuff);
  };

  /**
   * Shows quantity selection when user either user clicks on one of the search
   * results or successfully finds a product using its barcode.
   */
  @action
  private handleSelect = (foodstuff: Foodstuff) => {
    this.props.views!.push("center", "Quantity", {
      foodstuff,
      select: this.props.select
    });
  };
}

/**
 * Component that wraps search controls which include the search bar.
 */
// prettier-ignore
const Controls = styled.div`
  padding: ${({ theme }) => theme.paddingSecondary} ${({ theme }) => theme.padding};
  border-bottom: solid 1px ${({ theme }) => theme.borderColor};
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Component with overflow set to auto.
 */
const AutoOverflow = styled.div`
  overflow: auto;
`;

/**
 * Grid that contains all food information components of found foodstuffs.
 */
const Results = styled.div`
  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  display: grid;
  gap: ${({ theme }) => theme.paddingSecondary};
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(${({ theme }) => theme.widthSmall} / 2), 1fr)
  );
  grid-template-rows: min-content;
`;

/**
 * Button that on click opens foodstuff addition scene.
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

  color: ${({ theme }) => theme.colorOrange};
  font-size: 3.5rem;

  cursor: pointer;
`;
