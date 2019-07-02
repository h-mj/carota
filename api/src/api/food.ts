import * as Router from "koa-router";
import { Schema, is } from "./middleware/validator";
import { UNITS_ENUM, Food } from "../entity/Food";
import { createIdNotFoundError } from "./utility/errors";
import { define } from "./utility/routes";

/**
 * Router, which handles all routes related to food.
 */
export const foodRouter = new Router();

/**
 * Save request body schema.
 */
const SAVE_SCHEMA: Schema<"food", "save"> = {
  id: is
    .string()
    .guid()
    .optional(),
  name: is.string().trim(),
  barcode: is.string().optional(),
  unit: is.string().valid(Object.keys(UNITS_ENUM)),
  nutritionDeclaration: {
    energy: is.number().precision(2),
    fat: is.number().precision(2),
    saturates: is.number().precision(2),
    monoUnsaturates: is
      .number()
      .precision(2)
      .optional(),
    polyunsaturates: is
      .number()
      .precision(2)
      .optional(),
    carbohydrate: is.number().precision(2),
    sugars: is.number().precision(2),
    polyols: is
      .number()
      .precision(2)
      .optional(),
    starch: is
      .number()
      .precision(2)
      .optional(),
    fibre: is
      .number()
      .precision(2)
      .optional(),
    protein: is.number().precision(2),
    salt: is.number().precision(2)
  }
};

define(foodRouter, "food", "save", SAVE_SCHEMA, async context => {
  const { id, nutritionDeclaration, ...rest } = context.state.body;
  const food = id === undefined ? new Food() : await Food.findOne({ id });

  if (food === undefined) {
    throw createIdNotFoundError(id!, Food.name, ["id"]);
  }

  Object.assign(food, rest, nutritionDeclaration, {
    editor: context.state.account
  });

  context.state.data = (await food.save()).toData();
});
