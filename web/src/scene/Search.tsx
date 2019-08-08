import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Component } from "../component/Component";
import { TextField } from "../component/TextField";
import { styled } from "../styling/theme";
import { Food } from "../model/Food";

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
            autoFocus={true}
            name="query"
            value={this.query}
            onChange={this.handleChange}
            type="search"
          />
        </Controls>
        <Results>
          {this.props.foods!.getAll().map(food => (
            <Result key={food.id} food={food} />
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
}

const Controls = styled.div`
  position: sticky;
  top: 0;

  padding: calc(${({ theme }) => theme.padding} / 3)
    ${({ theme }) => theme.padding};
  box-sizing: border-box;

  border-bottom: solid 1px ${({ theme }) => theme.borderColor};

  background-color: ${({ theme }) => theme.backgroundColor};
`;

const Results = styled.div`
  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;

  flex: 1 1 auto;

  display: inline-grid;
  gap: calc(${({ theme }) => theme.padding} / 3);
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(4 * ${({ theme }) => theme.height}), 1fr)
  );
  grid-template-rows: max-content;
`;

/**
 * Result component props.
 */
interface ResultProps {
  /**
   * Corresponding food model instance.
   */
  food: Food;
}

@inject("views")
@observer
class Result extends Component<ResultProps> {
  public render() {
    const { name, nutritionDeclaration } = this.props.food;

    return (
      <ResultContainer onClick={this.handleClick}>
        <Name>{name}</Name>
        <Nutrients>
          <Nutrient>
            <Title>Energy</Title>
            <Amount>{100 * nutritionDeclaration.energy}</Amount>
          </Nutrient>
          <Nutrient>
            <Title>Fat</Title>
            <Amount>{100 * nutritionDeclaration.fat}</Amount>
          </Nutrient>
          <Nutrient>
            <Title>Carbs</Title>
            <Amount>{100 * nutritionDeclaration.carbohydrate}</Amount>
          </Nutrient>
          <Nutrient>
            <Title>Protein</Title>
            <Amount>{100 * nutritionDeclaration.protein}</Amount>
          </Nutrient>
        </Nutrients>
      </ResultContainer>
    );
  }

  /**
   * Shows food item editing scene on the side when user clicks on food item
   * result.
   */
  @action
  private handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    this.props.views!.aside("Edit", {
      food: this.props.food
    });
  };
}

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;

  height: calc(4 * ${({ theme }) => theme.height});

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-sizing: border-box;

  cursor: pointer;
`;

const Name = styled.div`
  width: 100%;

  flex: 1 1 auto;

  padding: calc(${({ theme }) => theme.padding} / 3);
  box-sizing: border-box;

  color: ${({ theme }) => theme.primaryColor};
`;

const Nutrients = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  display: flex;

  border-top: solid 1px ${({ theme }) => theme.borderColor};
  box-sizing: border-box;
`;

const Nutrient = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 0.7rem;
  letter-spacing: 0;
  padding-bottom: calc(${({ theme }) => theme.padding} / 9);
`;

const Amount = styled.div`
  display: flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.primaryColor};
`;
