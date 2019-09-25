import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";
import { Not } from "typeorm";

import * as Router from "@koa/router";

import { MealDto } from "../../types";
import { Account } from "../entity/Account";
import { Meal } from "../entity/Meal";
import { BadRequestError } from "../error/BadRequestError";
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
 * Remove meal request data transfer object type.
 */
type RemoveMealDto = Success<typeof removeMealDtoValidator>;

/**
 * Removes a meal with specified ID from meal linked list and re-links the broken linked list.
 */
const unlink = async (meal: Meal) => {
  const previous = await meal.previous;
  const nextId = meal.nextId;

  meal.nextId = null;
  await meal.save();

  if (previous !== undefined) {
    previous.nextId = nextId;
    await previous.save();
  }

  await meal.reload();
};

/**
 * Removes a meal with specified ID and fixes the meal linked list.
 */
const remove = async ({ id }: RemoveMealDto, account: Account) => {
  const meal = await Meal.findOne({ id });

  if (meal === undefined) {
    throw createIdNotFoundError(id, Meal.name, ["id"]);
  }

  if (meal.accountId !== account.id || account.rights !== "All") {
    throw new ForbiddenError("You are not allowed to delete this meal.");
  }

  await unlink(meal);
  await meal.remove();

  return true as const;
};

/**
 * Validates insert meal request body.
 */
// prettier-ignore
const insertMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  nextId: deviate().optional().string().guid()
})

/**
 * Insert meal request data transfer object type.
 */
export type InsertMealDto = Success<typeof insertMealDtoValidator>;

/**
 * Changes meal order by moving meal with with ID `id` in front of meal with ID
 * `nextId`. If `nextId` is `undefined`, then meal is moved to the back and will
 * be the last at that date.
 *
 * Returns all meals with same date as meals with IDS `id` and `nextId` with
 * updated order.
 */
const insert = async ({ id, nextId }: InsertMealDto, account: Account) => {
  const meal = await Meal.findOne({ id });
  const next =
    nextId !== undefined ? await Meal.findOne({ id: nextId }) : undefined;

  if (meal === undefined) {
    throw createIdNotFoundError(id, Meal.name, ["id"]);
  } else if (nextId !== undefined && next === undefined) {
    throw createIdNotFoundError(nextId, Meal.name, ["nextId"]);
  } else if (next !== undefined && meal.id === next.id) {
    throw new BadRequestError("Cannot insert meal ahead of itself.");
  } else if (next !== undefined && meal.accountId !== next.accountId) {
    throw new BadRequestError("Meals are owned by different accounts.");
  } else if (meal.accountId !== account.id) {
    throw new ForbiddenError("You are not allowed to move this meal.");
  }

  await unlink(meal);

  const previous =
    next !== undefined
      ? await next.previous
      : await Meal.findOne({
          account,
          id: Not(meal.id),
          date: meal.date,
          nextId: null
        });

  if (previous !== undefined) {
    previous.nextId = meal.id;
    await previous.save();
  }

  if (next !== undefined) {
    meal.nextId = next.id;
    meal.date = next.date;
    await meal.save();
  }

  return get(meal, account);
};

/**
 * Defines the request and response message body types of meal router endpoints.
 */
export interface MealController {
  add: Query<AddMealDto, MealDto>;
  get: Query<GetMealsDto, MealDto[]>;
  insert: Query<InsertMealDto, MealDto[]>;
  remove: Query<RemoveMealDto, true>;
}

/**
 * Router which endpoints manage the invitation entities.
 */
export const mealRouter = new Router();

// Define all meal controller endpoints.
define(mealRouter, "meal", "add", addMealDtoValidator, add);
define(mealRouter, "meal", "get", getMealsDtoValidator, get);
define(mealRouter, "meal", "insert", insertMealDtoValidator, insert);
define(mealRouter, "meal", "remove", removeMealDtoValidator, remove);
