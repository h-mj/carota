import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";

import * as Router from "@koa/router";

import { MealDto } from "../../types";
import { Account } from "../entity/Account";
import { Meal } from "../entity/Meal";
import { ForbiddenError } from "../error/ForbiddenError";
import { createIdNotFoundError } from "../utility/errors";
import { define } from "../utility/routes";
import { Query } from "./";

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

/**
 * Adds a new meal with specified name and date as the last meal.
 */
const add = async ({ name, date }: AddMealDto, account: Account) => {
  const last = await Meal.findOne({ account, date, nextId: null });
  const meal = await Meal.create({ account, name, date }).save();

  if (last !== undefined) {
    last.nextId = meal.id;
    last.save();
  }

  return meal.toDto();
};

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

/**
 * Returns all meals with specified date.
 */
const get = async ({ date }: GetMealsDto, account: Account) => {
  return (await Meal.find({ account, date })).map(meal => meal.toDto());
};

/**
 * Validates remove meal request body.
 */
// prettier-ignore
const removeMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
})

/**
 * Remove meal request data transfer object.
 */
type RemoveMealDto = Success<typeof removeMealDtoValidator>;

/**
 * Removes a meal with specified ID and fixes the meal linked list.
 */
const remove = async ({ id }: RemoveMealDto, account: Account) => {
  const meal = await Meal.findOne({ id });

  if (meal === undefined) {
    throw createIdNotFoundError(id, Meal.name, ["id"]);
  }

  if (meal.account.id !== account.id || account.rights !== "All") {
    throw new ForbiddenError("You are not allowed to delete this meal.");
  }

  const previous = await meal.previous;

  await meal.remove(); // This also sets `nextId` of previous meal to `null`.

  if (previous !== undefined) {
    previous.nextId = meal.nextId;
    await previous.save();
  }

  return true as const;
};

/**
 * Defines the request and response message body types of meal router endpoints.
 */
export interface MealController {
  add: Query<AddMealDto, MealDto>;
  get: Query<GetMealsDto, MealDto[]>;
  remove: Query<RemoveMealDto, true>;
}

/**
 * Router which endpoints manage the invitation entities.
 */
export const mealRouter = new Router();

// Define all meal controller endpoints.
define(mealRouter, "meal", "add", addMealDtoValidator, add);
define(mealRouter, "meal", "get", getMealsDtoValidator, get);
define(mealRouter, "meal", "remove", removeMealDtoValidator, remove);
