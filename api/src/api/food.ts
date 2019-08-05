import * as Router from "@koa/router";
import { is, Schema } from "./middleware/validator";
import { Food, UNITS_ENUM } from "../entity/Food";
import { createIdNotFoundError } from "./utility/errors";
import { define } from "./utility/routes";

/**
 * Router, which handles all routes related to food.
 */
export const foodRouter = new Router();

/**
 * Nutrient amount schema.
 */
const amount = is.number().precision(4);

/**
 * Save request body schema.
 */
const SAVE_SCHEMA: Schema<"food", "save"> = {
  id: is
    .string()
    .guid()
    .optional(),
  name: is.string().trim(),
  barcode: is
    .string()
    .trim()
    .regex(/^\d{13}$/)
    .optional(),
  unit: is.string().valid(Object.keys(UNITS_ENUM)),
  nutritionDeclaration: {
    energy: amount,
    fat: amount,
    saturates: amount.optional(),
    monoUnsaturates: amount.optional(),
    polyunsaturates: amount.optional(),
    carbohydrate: amount,
    sugars: amount.optional(),
    polyols: amount.optional(),
    starch: amount.optional(),
    fibre: amount.optional(),
    protein: amount,
    salt: amount.optional()
  },
  pieceQuantity: amount.optional()
};

define(foodRouter, "food", "save", SAVE_SCHEMA, async context => {
  const {
    id,
    name,
    barcode,
    unit,
    nutritionDeclaration,
    pieceQuantity
  } = context.state.body;

  if (id !== undefined && (await Food.findOne({ id })) === undefined) {
    throw createIdNotFoundError(id!, Food.name, ["id"]);
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
 * Returns a function that checks whether or not given food matches the query
 * string.
 *
 * @param query Search query string.
 */
const matches = (query: string) => (food: Food) => {
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
 * Search request body schema.
 */
const SEARCH_SCHEMA: Schema<"food", "search"> = {
  query: is.string()
};

define(foodRouter, "food", "search", SEARCH_SCHEMA, async context => {
  const foods = await Food.find();

  context.state.data = foods
    .filter(matches(context.state.body.query))
    .map(food => food.toData())
    .slice(0, 20);
});
