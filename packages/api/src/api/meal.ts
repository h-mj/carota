import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";

import * as Router from "@koa/router";

import { MealDto } from "../../types";
import { Meal } from "../entity/Meal";
import { ForbiddenError } from "../error/ForbiddenError";
import { createIdNotFoundError } from "../utility/errors";
import { define } from "../utility/routes";
import { Query } from "./";

/**
 * Router which endpoints manage the invitation entities.
 */
export const mealRouter = new Router();

/**
 * Defines the request and response message body types of meal router endpoints.
 */
export interface MealController {
  add: Query<AddMealDto, MealDto>;
  delete: Query<DeleteMealDto, true>;
  get: Query<GetMealsDto, MealDto[]>;
}

/**
 * Checks whether date's string representation is a valid ISO date.
 */
const validDate = (representation: string) => {
  const date = DateTime.fromISO(representation);

  return date.isValid ? ok(date.toISODate()) : err("invalidDate");
};

/**
 * Checks whether date's string representation is within one month from current date.
 *
 * @param representation String representation of some date.
 */
const withinMonth = (representation: string) => {
  const difference = DateTime.fromISO(representation).diffNow();

  return Math.abs(difference.as("months")) > 1
    ? err("notWithinMonth")
    : ok(representation);
};

/**
 * Validates add meal request body.
 */
// prettier-ignore
const addMealDtoValidator = deviate().object().shape({
  name: deviate().string().trim().notEmpty(),
  date: deviate().string().append(validDate).append(withinMonth)
})

/**
 * Add meal request data transfer object type.
 */
type AddMealDto = Success<typeof addMealDtoValidator>;

define(mealRouter, "meal", "add", addMealDtoValidator, async context => {
  const {
    account,
    body: { name, date }
  } = context.state;

  const template = Meal.create({ account, name, date });

  context.state.data = (await template.save()).toDto();
});

/**
 * Validates get meals request body.
 */
// prettier-ignore
const getMealsDtoValidator = deviate().object().shape({
  date: deviate().string().append(validDate)
})

/**
 * Get meals request data transfer object type.
 */
type GetMealsDto = Success<typeof getMealsDtoValidator>;

define(mealRouter, "meal", "get", getMealsDtoValidator, async context => {
  const {
    account,
    body: { date }
  } = context.state;

  context.state.data = (await Meal.find({ account, date })).map(meal =>
    meal.toDto()
  );
});

/**
 * Validates delete meal request body.
 */
// prettier-ignore
const deleteMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
})

/**
 * Delete meal request data transfer object.
 */
type DeleteMealDto = Success<typeof deleteMealDtoValidator>;

define(mealRouter, "meal", "delete", deleteMealDtoValidator, async context => {
  const {
    account,
    body: { id }
  } = context.state;

  const meal = await Meal.findOne({ id });

  if (meal === undefined) {
    throw createIdNotFoundError(id, Meal.name, ["id"]);
  }

  if (meal.account.id !== account.id || account.rights !== "All") {
    throw new ForbiddenError("You are not allowed to delete this meal.");
  }

  await meal.remove();

  context.state.data = true;
});
