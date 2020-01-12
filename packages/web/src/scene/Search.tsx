import { Failure, deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Scenes } from "../base/Scene";
import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Action } from "../component/Action";
import { Barcode } from "../component/collection/icons";
import { FoodstuffView } from "../component/FoodstuffView";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Foodstuff } from "../model/Foodstuff";
import { Meal } from "../model/Meal";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { hasEnvironmentCamera } from "../utility/scanner";

/**
 * Query string validator.
 */
const validate = deviate<string>()
  .trim()
  .minLength(3);

/**
 * Potential occurred error reason string.
 */
type Reason = Failure<typeof validate> | "notFound";

/**
 * Search scene component props.
 */
interface SearchProps {
  /**
   * Meal to which foodstuff is being added.
   */
  meal: Meal;

  /**
   * Scene close callback.
   */
  onClose: () => void;
}

/**
 * Search scene component translation.
 */
interface SearchTranslation {
  /**
   * Error translations.
   */
  reasons: Record<Reason, string>;

  /**
   * Search scene title translation.
   */
  title: string;
}

/**
 * Scene which is used for selecting a foodstuff by searching for it by its
 * name.
 */
@inject("foodstuffStore", "viewStore")
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
   * Occurred error reason.
   */
  @observable private reason?: Reason;

  /**
   * ID of a timeout after which search request is made. Used to limit search
   * requests when user is still typing.
   */
  private timeoutId = 0;

  /**
   * Whether or not full search is successfully completed.
   */
  @observable private completed = false;

  /**
   * Whether the scan button should be shown.
   */
  @observable private showScanButton = false;

  /**
   * Pushed scene reference, either `Edit` or `Scanner` scene.
   */
  private scene?: Scenes;

  /**
   * Sets the name of this scene.
   */
  public constructor(
    props: SearchProps & DefaultSceneComponentProps<"Search">
  ) {
    super("Search", props);

    this.checkEnvironmentCamera();
    this.props.foodstuffStore!.getLatestFrequent(this.props.meal.name);
  }

  /**
   * Renders search bar and search results.
   */
  public render() {
    return (
      <>
        <TitleBar onClose={this.props.onClose} title={this.translation.title} />

        <Controls>
          <TextField
            autoFocus={true}
            errorMessage={
              this.reason !== undefined
                ? this.translation.reasons[this.reason]
                : undefined
            }
            invalid={this.reason !== undefined}
            name="query"
            value={this.query}
            onChange={this.handleChange}
            type="search"
          />
        </Controls>

        <AutoOverflow>
          <Results>
            {(this.query === ""
              ? this.props.foodstuffStore!.frequentOf(this.props.meal.name)
              : this.completed
              ? this.props.foodstuffStore!.resultsOf(this.query)
              : []
            ).map(foodstuff => (
              <FoodstuffView
                key={foodstuff.id}
                foodstuff={foodstuff}
                onSelect={this.handleFoodstuffSelect}
                showEditor={this.showEditor}
              />
            ))}
            {this.completed && <Add onClick={() => this.showEditor()}>+</Add>}
          </Results>
        </AutoOverflow>

        {this.showScanButton && (
          <Action fixed={true} icon={<Barcode />} onClick={this.showScanner} />
        )}
      </>
    );
  }

  /**
   * Checks whether there's an environment camera
   */
  @action
  private checkEnvironmentCamera = async () => {
    this.showScanButton = await hasEnvironmentCamera();
  };

  /**
   * Updates query value and sets or overrides a timeout after which search
   * request is made.
   */
  @action
  private handleChange = (_: "query", value: string) => {
    this.query = value;
    this.reason = undefined;

    window.clearTimeout(this.timeoutId);
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
      await this.props.foodstuffStore!.search(result.value);
    } else {
      this.reason = this.query.length > 0 ? result.value : undefined;
    }

    this.completed = result.ok;
  };

  /**
   * Shows foodstuff edit scene when user clicks on add result.
   */
  @action
  private showEditor = (foodstuff?: Foodstuff) => {
    this.scene = this.props.viewStore!.push("left", "FoodstuffEdit", {
      foodstuff,
      name: this.query,
      onSave: this.hideEditor
    });
  };

  /**
   * Closes foodstuff editor.
   */
  @action
  private hideEditor = (updated: boolean) => {
    this.props.viewStore!.pop(this.scene!);

    if (updated) {
      this.completed = false;
      this.search();
    }
  };

  /**
   * Shows the scanner on scan button press.
   */
  @action
  private showScanner = () => {
    this.scene = this.props.viewStore!.push("main", "Scanner", {
      onScan: this.handleScan
    });
  };

  /**
   * Scanning callback function.
   */
  @action
  private handleScan = async (barcode?: string) => {
    this.props.viewStore!.pop(this.scene!);

    if (barcode === undefined) {
      return;
    }

    const foodstuff = await this.props.viewStore!.load(
      this.props.foodstuffStore!.findByBarcode(barcode),
      1
    );

    if (foodstuff === undefined) {
      this.reason = "notFound";
      return;
    }

    this.handleFoodstuffSelect(foodstuff);
  };

  /**
   * Shows quantity selection when user either user clicks on one of the search
   * results or successfully finds a product using its barcode.
   */
  @action
  private handleFoodstuffSelect = (foodstuff: Foodstuff) => {
    this.scene = this.props.viewStore!.push("center", "DishEdit", {
      foodstuff,
      meal: this.props.meal,
      onClose: this.props.onClose
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

  color: ${({ theme }) => theme.colorActive};
  font-size: 3.5rem;

  cursor: pointer;
`;
