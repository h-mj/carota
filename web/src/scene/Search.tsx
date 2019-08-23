import { deviate } from "deviator";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { TranslatedComponent } from "../base/TranslatedComponent";
import {
  Carbohydrate,
  Energy,
  Fat,
  Protein
} from "../component/collection/icons";
import { TextField } from "../component/TextField";
import { Food } from "../model/Food";
import { styled } from "../styling/theme";

/**
 * Object that maps nutrient names to its icon components.
 */
const ICONS = {
  energy: Energy,
  fat: Fat,
  protein: Protein,
  carbohydrate: Carbohydrate
} as const;

/**
 * Union of information table nutrient names.
 */
type Nutrient = keyof typeof ICONS;

/**
 * `number.toLocaleString` function options.
 */
const FORMAT_OPTIONS = {
  minimumFractionDigits: 1
};

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
          <SearchResults>
            {this.props.foods!.getAll().map(food => (
              <SearchResult key={food.id} food={food} select={this.select} />
            ))}
            <Add onClick={this.showEditor}>+</Add>
          </SearchResults>
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

    if (result.kind !== "Err") {
      await this.props.foods!.search(result.value);
    } else {
      this.props.foods!.clear();
    }

    this.completed = result.kind !== "Err";
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
   * Food item and quantity selection callback.
   */
  @action
  private select = (food: Food, quantity: number) => {
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
 * Grid that contains all search results.
 */
const SearchResults = styled.div`
  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  display: grid;
  gap: calc(${({ theme }) => theme.padding} / 3);
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(3 * ${({ theme }) => theme.height}), 1fr)
  );
  grid-template-rows: min-content;
`;

/**
 * Result component props.
 */
interface SearchResultProps {
  /**
   * Corresponding food model instance.
   */
  food: Food;

  /**
   * Food item selection callback.
   */
  select: (food: Food, quantity: number) => void;
}

/**
 * Search result translation.
 */
interface SearchResultTranslation {
  /**
   * Quantities per 100 units text.
   */
  per: string;
}

/**
 * Single result that displays food item name along with nutrition table.
 */
@inject("views")
@observer
export class SearchResult extends TranslatedComponent<
  "SearchResult",
  SearchResultProps,
  SearchResultTranslation
> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: SearchResultProps) {
    super("SearchResult", props);
  }

  /**
   * Renders food item information.
   */
  public render() {
    const { name, nutritionDeclaration, unit } = this.props.food;

    return (
      <ResultContainer onClick={this.handleClick}>
        <Name>{name}</Name>

        <Stats>
          <div>
            {this.translation.per.replace(
              "{unit}",
              this.props.views!.translation.units[unit]
            )}
          </div>

          {Object.entries(ICONS).map(([nutrient, IconComponent]) => {
            const quantity = (
              100 * nutritionDeclaration[nutrient as Nutrient]
            ).toLocaleString("et-EE", FORMAT_OPTIONS);

            const unit = this.props.views!.translation.units[
              nutrient === "energy" ? "kcal" : "g"
            ];

            return (
              <Nutrient key={nutrient}>
                <Icon>
                  <IconComponent />
                </Icon>
                <Quantity>{quantity}</Quantity>
                <Unit>{unit}</Unit>
              </Nutrient>
            );
          })}
        </Stats>
      </ResultContainer>
    );
  }

  /**
   * Shows quantity selection when user clicks of food item.
   */
  @action
  private handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.views!.push("center", "Quantity", {
      food: this.props.food,
      select: this.props.select
    });
  };
}

/**
 * Component that contains information about a food item.
 */
const ResultContainer = styled.div`
  min-height: 11.5rem;

  display: flex;
  flex-direction: column;

  padding: calc(${({ theme }) => theme.padding} / 3);
  box-sizing: border-box;

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};

  cursor: pointer;

  & > * {
    margin-bottom: calc(${({ theme }) => theme.padding} / 3);
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Food nutritional stats wrapper.
 */
const Stats = styled.div`
  & > * {
    margin-bottom: calc(${({ theme }) => theme.padding} / 6);
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Custom result element that is used to create a food item.
 */
const Add = styled(ResultContainer)`
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.orange};
  font-size: 3.5rem;
`;

/**
 * Food item name wrapper.
 */
const Name = styled.div`
  width: 100%;
  flex: 1 1 auto;
  color: ${({ theme }) => theme.primaryColor};
`;

/**
 * Single row of nutrient table.
 */
const Nutrient = styled.div`
  display: flex;
  align-items: center;

  & > * {
    width: 100%;
  }
`;

/**
 * Nutrient icon wrapper that resizes the icon inside.
 */
const Icon = styled.span`
  height: calc(${({ theme }) => theme.padding} / 2);

  & > * {
    height: 100%;
  }
`;

/**
 * Displays nutrient quantity.
 */
const Quantity = styled.span`
  width: 100%;
  color: ${({ theme }) => theme.primaryColor};
  font-feature-settings: "tnum" 1;
  text-align: center;
`;

/**
 * Displays nutrient amount unit.
 */
const Unit = styled.span`
  color: ${({ theme }) => theme.secondaryColor};
  text-align: right;
`;
