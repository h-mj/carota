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
import { from } from "../utility/shift";

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
const QUERY_VALIDATOR = from<string>()
  .trim()
  .notEmpty()
  .build();

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
              <SearchResult key={food.id} food={food} />
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
    const result = QUERY_VALIDATOR(this.query);

    if (result.kind === "Ok") {
      await this.props.foods!.search(result.value);
    } else {
      this.props.foods!.clear();
    }

    this.completed = result.kind === "Ok";
    this.timeoutId = undefined;
  };

  /**
   * Shows food editor when user clicks on add result.
   */
  @action
  private showEditor = () => {
    this.props.views!.push("left", "Edit", {});
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
}

/**
 * Search result translation.
 */
interface SearchResultTranslation {
  units: Record<"g" | "kcal" | "ml", string>;
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
              this.translation.units[unit]
            )}
          </div>

          {Object.entries(ICONS).map(([nutrient, IconComponent]) => (
            <Nutrient key={nutrient}>
              <Icon>
                <IconComponent />
              </Icon>

              <Amount>
                {(
                  100 * nutritionDeclaration[nutrient as Nutrient]
                ).toLocaleString("et-EE", FORMAT_OPTIONS)}
              </Amount>

              <Unit>
                {this.translation.units[nutrient === "energy" ? "kcal" : "g"]}
              </Unit>
            </Nutrient>
          ))}
        </Stats>
      </ResultContainer>
    );
  }

  /**
   * Shows food item editing scene on the side when user clicks on food item
   * result.
   */
  @action
  private handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.views!.push("center", "Amount", {});
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
 * Displays nutrient amount value.
 */
const Amount = styled.span`
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
