import { deviate, Success } from "deviator";

import * as Router from "@koa/router";

import { Food, FoodDto, UNITS } from "../entity/Food";
import { ForbiddenError } from "../error/ForbiddenError";
import { createIdNotFoundError } from "../utility/errors";
import { define } from "../utility/routes";
import { Query } from "./";

/**
 * Router which endpoints manage the food entities.
 */
export const foodRouter = new Router();

/**
 * Defines the request and response message body types of food router endpoints.
 */
export interface FoodController {
  delete: Query<DeleteFoodDto, boolean>;
  save: Query<SaveFoodDto, FoodDto>;
  search: Query<SearchFoodDto, FoodDto[]>;
}

/**
 * Nutrient quantity validator.
 */
const quantity = deviate()
  .number()
  .round(4);

/**
 * Optional nutrient quantity validator.
 */
const optionalQuantity = deviate()
  .optional()
  .append(quantity);

/**
 * Validates save food request body.
 */
// prettier-ignore
const saveFoodDtoValidator = deviate().object().shape({
  id: deviate().optional().string().guid(),
  name: deviate().string().trim().notEmpty(),
  barcode: deviate().optional().string().trim().regex(/^\d{13}$/),
  unit: deviate().string().options(UNITS),
  nutritionDeclaration: deviate().object().shape({
    energy: quantity,
    fat: quantity,
    saturates: optionalQuantity,
    monoUnsaturates: optionalQuantity,
    polyunsaturates: optionalQuantity,
    carbohydrate: quantity,
    sugars: optionalQuantity,
    polyols: optionalQuantity,
    starch: optionalQuantity,
    fibre: optionalQuantity,
    protein: quantity,
    salt: optionalQuantity
  }),
  pieceQuantity: optionalQuantity
});

/**
 * Save food request data transfer object type.
 */
type SaveFoodDto = Success<typeof saveFoodDtoValidator>;

define(foodRouter, "food", "save", saveFoodDtoValidator, async context => {
  const { account } = context.state;
  const {
    id,
    name,
    barcode,
    unit,
    nutritionDeclaration,
    pieceQuantity
  } = context.state.body;

  if (id !== undefined) {
    const food = await Food.findOne({ id });

    if (food === undefined) {
      throw createIdNotFoundError(id, Food.name, ["id"]);
    }

    if (account.id !== food.editor.id && account.rights !== "All") {
      throw new ForbiddenError("You can not edit this food item.");
    }
  }

  const food = Food.create({
    id,
    name,
    barcode,
    unit,
    nutritionDeclaration,
    pieceQuantity,
    editor: context.state.account
  });

  context.state.data = (await food.save()).toDto();
});

/**
 * Validates search food request body.
 */
// prettier-ignore
const searchFoodDtoValidator = deviate().object().shape({
  query: deviate().string().notEmpty()
});

/**
 * Search food request data transfer object type.
 */
type SearchFoodDto = Success<typeof searchFoodDtoValidator>;

/**
 * Returns a function that checks whether or not given food matches the query
 * string.
 *
 * @param query Search query string.
 */
const matches = (query: string) => (food: Food): boolean => {
  const name = food.name.toLowerCase();

  return (
    query
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .find(part => !name.includes(part)) === undefined
  );
};

define(foodRouter, "food", "search", searchFoodDtoValidator, async context => {
  const foods = await Food.find();

  context.state.data = foods
    .filter(matches(context.state.body.query))
    .map(food => food.toDto())
    .slice(0, 20);
});
/**
 * Validates Delete food request body validator.
 */
// prettier-ignore
const deleteFoodDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

/**
 * Delete food request data transfer object type.
 */
type DeleteFoodDto = Success<typeof deleteFoodDtoValidator>;

define(foodRouter, "food", "delete", deleteFoodDtoValidator, async context => {
  const {
    account,
    body: { id }
  } = context.state;

  const food = await Food.findOne({ id });

  if (food === undefined) {
    throw createIdNotFoundError(id, Food.name, ["id"]);
  }

  // Allow only accounts with all rights to delete food items.
  if (account.rights !== "All") {
    throw new ForbiddenError("You can not delete this food item.");
  }

  await food.remove();

  context.state.data = true;
});
