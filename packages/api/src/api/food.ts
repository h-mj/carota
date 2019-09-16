import { deviate } from "deviator";

import * as Router from "@koa/router";

import { Food, FoodData, UNITS, Units } from "../entity/Food";
import { NutritionDeclarationData } from "../entity/NutritionDeclaration";
import { ForbiddenError } from "../error/ForbiddenError";
import { createIdNotFoundError } from "../utility/errors";
import { define } from "../utility/routes";
import { Query } from "./";

/**
 * Router, which handles all routes related to food.
 */
export const foodRouter = new Router();

/**
 * Food controller endpoints, their request message body and response message
 * body data types.
 */
export interface FoodController {
  delete: Query<DeleteBody, boolean>;
  save: Query<SaveBody, FoodData>;
  search: Query<SearchBody, FoodData[]>;
}

/**
 * Save request message body type.
 */
interface SaveBody {
  /**
   * Food ID, if updating.
   */
  id?: string;

  /**
   * The name of the food.
   */
  name: string;

  /**
   * Barcode of the food, if exists.
   */
  barcode?: string;

  /**
   * Serving unit.
   */
  unit: Units;

  /**
   * Food nutrition declaration.
   */
  nutritionDeclaration: NutritionDeclarationData;

  /**
   * Quantity of one piece in units, if one piece of product exists.
   */
  pieceQuantity?: number;
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
 * Save request body validator.
 */
// prettier-ignore
const saveValidator = deviate().object().shape({
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

define(foodRouter, "food", "save", saveValidator, async context => {
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

  context.state.data = (await food.save()).toData();
});

/**
 * Search request message body type.
 */
interface SearchBody {
  /**
   * Search query string.
   */
  query: string;
}

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

/**
 * Search request body validator.
 */
// prettier-ignore
const searchValidator = deviate().object().shape({
  query: deviate().string().notEmpty()
});

define(foodRouter, "food", "search", searchValidator, async context => {
  const foods = await Food.find();

  context.state.data = foods
    .filter(matches(context.state.body.query))
    .map(food => food.toData())
    .slice(0, 20);
});

/**
 * Delete request message body type.
 */
interface DeleteBody {
  /**
   * Deletion target food ID.
   */
  id: string;
}

/**
 * Delete request body validator.
 */
// prettier-ignore
const deleteValidator = deviate().object().shape({
  id: deviate().string().guid()
});

define(foodRouter, "food", "delete", deleteValidator, async context => {
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
