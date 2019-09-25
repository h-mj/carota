import { deviate, Success } from "deviator";

import * as Router from "@koa/router";

import { Foodstuff, FoodstuffDto, UNITS } from "../entity/Foodstuff";
import { ForbiddenError } from "../error/ForbiddenError";
import { createIdNotFoundError } from "../utility/errors";
import { define } from "../utility/routes";
import { Query } from "./";

/**
 * Router which endpoints manage the foodstuff entities.
 */
export const foodstuffRouter = new Router();

/**
 * Defines the request and response message body types of foodstuff router
 * endpoints.
 */
export interface FoodController {
  delete: Query<DeleteFoodstuffDto, true>;
  save: Query<SaveFoodstuffDto, FoodstuffDto>;
  search: Query<SearchFoodstuffDto, FoodstuffDto[]>;
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
 * Validates save foodstuff request body.
 */
// prettier-ignore
const saveFoodstuffDtoValidator = deviate().object().shape({
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
 * Save foodstuff request data transfer object type.
 */
type SaveFoodstuffDto = Success<typeof saveFoodstuffDtoValidator>;

define(foodstuffRouter, "foodstuff", "save", saveFoodstuffDtoValidator, async context => {
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
    const foodstuff = await Foodstuff.findOne({ id });

    if (foodstuff === undefined) {
      throw createIdNotFoundError(id, Foodstuff.name, ["id"]);
    }

    if (account.id !== foodstuff.editorId && account.rights !== "All") {
      throw new ForbiddenError("You can not edit this foodstuff.");
    }
  }

  const template = Foodstuff.create({
    id,
    name,
    barcode,
    unit,
    nutritionDeclaration,
    pieceQuantity,
    editor: Promise.resolve(context.state.account)
  });

  context.state.data = (await template.save()).toDto();
});

/**
 * Validates search foodstuff request body.
 */
// prettier-ignore
const searchFoodstuffDtoValidator = deviate().object().shape({
  query: deviate().string().notEmpty()
});

/**
 * Search foodstuff request data transfer object type.
 */
type SearchFoodstuffDto = Success<typeof searchFoodstuffDtoValidator>;

/**
 * Returns a function that checks whether or not given foodstuff matches the
 * query string.
 *
 * @param query Search query string.
 */
const matches = (query: string) => (foodstuff: Foodstuff): boolean => {
  const name = foodstuff.name.toLowerCase();

  return (
    query
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .find(part => !name.includes(part)) === undefined
  );
};

define(foodstuffRouter, "foodstuff", "search", searchFoodstuffDtoValidator, async context => {
  const foodstuffs = await Foodstuff.find();

  context.state.data = foodstuffs
    .filter(matches(context.state.body.query))
    .map(food => food.toDto())
    .slice(0, 20);
});
/**
 * Validates delete foodstuff request body validator.
 */
// prettier-ignore
const deleteFoodstuffDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

/**
 * Delete foodstuff request data transfer object type.
 */
type DeleteFoodstuffDto = Success<typeof deleteFoodstuffDtoValidator>;

define(foodstuffRouter, "foodstuff", "delete", deleteFoodstuffDtoValidator, async context => {
  const {
    account,
    body: { id }
  } = context.state;

  const foodstuff = await Foodstuff.findOne({ id });

  if (foodstuff === undefined) {
    throw createIdNotFoundError(id, Foodstuff.name, ["id"]);
  }

  // Allow only accounts with all rights to delete foodstuffs.
  if (account.rights !== "All") {
    throw new ForbiddenError("You can not delete this foodstuff.");
  }

  await foodstuff.remove();

  context.state.data = true;
});
