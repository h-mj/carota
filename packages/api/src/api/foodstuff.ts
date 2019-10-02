import { deviate, Success } from "deviator";

import * as Router from "@koa/router";

import { Account } from "../entity/Account";
import { Foodstuff, FoodstuffDto, UNITS } from "../entity/Foodstuff";
import { ForbiddenError } from "../error/ForbiddenError";
import { createIdNotFoundError } from "../utility/errors";
import { define } from "../utility/routes";
import { Query } from "./";

/**
 * Nutrient quantity validator.
 */
const quantity = deviate()
  .number()
  .ge(0)
  .round(2);

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
  quantity: optionalQuantity,
  pieceQuantity: optionalQuantity,
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
});

/**
 * Save foodstuff request data transfer object type.
 */
type SaveFoodstuffDto = Success<typeof saveFoodstuffDtoValidator>;

/**
 * Creates or edits foodstuff with specified fields.
 */
const save = async (
  {
    id,
    name,
    barcode,
    unit,
    quantity,
    pieceQuantity,
    nutritionDeclaration
  }: SaveFoodstuffDto,
  account: Account
) => {
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
    pieceQuantity,
    quantity,
    nutritionDeclaration,
    editor: account
  });

  return (await template.save()).toDto();
};

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

/**
 * Finds all foodstuffs that match specified query.
 */
const search = async ({ query }: SearchFoodstuffDto) => {
  const foodstuffs = await Foodstuff.find();

  return foodstuffs
    .filter(matches(query))
    .map(food => food.toDto())
    .slice(0, 20);
};

/**
 * Validates remove foodstuff request body validator.
 */
// prettier-ignore
const removeFoodstuffDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

/**
 * Remove foodstuff request data transfer object type.
 */
type RemoveFoodstuffDto = Success<typeof removeFoodstuffDtoValidator>;

/**
 * Removes foodstuff with specified ID.
 */
const remove = async ({ id }: RemoveFoodstuffDto, account: Account) => {
  const foodstuff = await Foodstuff.findOne({ id });

  if (foodstuff === undefined) {
    throw createIdNotFoundError(id, Foodstuff.name, ["id"]);
  }

  // Allow only accounts with all rights to delete foodstuffs.
  if (account.rights !== "All") {
    throw new ForbiddenError("You can not delete this foodstuff.");
  }

  await foodstuff.remove();

  return true as const;
};

/**
 * Defines the request and response message body types of foodstuff router
 * endpoints.
 */
export interface FoodController {
  remove: Query<RemoveFoodstuffDto, true>;
  save: Query<SaveFoodstuffDto, FoodstuffDto>;
  search: Query<SearchFoodstuffDto, FoodstuffDto[]>;
}

/**
 * Router which endpoints manage the foodstuff entities.
 */
export const foodstuffRouter = new Router();

// Define all foodstuff controller endpoints.
define(foodstuffRouter, "foodstuff", "save", saveFoodstuffDtoValidator, save);
define(foodstuffRouter, "foodstuff", "search", searchFoodstuffDtoValidator, search);
define(foodstuffRouter, "foodstuff", "remove", removeFoodstuffDtoValidator, remove);
