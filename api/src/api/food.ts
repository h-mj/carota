import * as Router from "koa-router";
import { Schema, is } from "./middleware/validator";
import { UNITS_ENUM, Food } from "../entity/Food";
import { define } from "./utility/routes";
import { createIdNotFoundError } from "./utility/errors";

/**
 * Router, which handles all routes related to food.
 */
export const foodRouter = new Router();

/**
 * Save request body schema.
 */
const SAVE_SCHEMA: Schema<"/food/save"> = {
  id: is
    .string()
    .guid()
    .optional(),
  name: is.string().trim(),
  barcode: is.string().optional(),
  unit: is.string().valid(Object.keys(UNITS_ENUM)),
  energy: is.number().precision(2),
  fat: is.number().precision(2),
  saturates: is.number().precision(2),
  monoUnsaturates: is.number().precision(2),
  polyunsaturates: is.number().precision(2),
  carbohydrate: is.number().precision(2),
  sugars: is.number().precision(2),
  polyols: is.number().precision(2),
  starch: is.number().precision(2),
  fibre: is.number().precision(2),
  protein: is.number().precision(2),
  salt: is.number().precision(2)
};

define(foodRouter, "/food/save", SAVE_SCHEMA, async context => {
  const { id, ...rest } = context.state.body;
  const food = id === undefined ? new Food() : await Food.findOne({ id });

  if (food === undefined) {
    throw createIdNotFoundError(id!, Food.name, "id");
  }

  Object.assign(food, rest, { editor: context.state.account });

  context.state.data = (await food.save()).toData();
});
