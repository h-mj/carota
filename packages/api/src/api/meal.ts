import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";
import { Not } from "typeorm";

import * as Router from "@koa/router";

import { MealDto } from "../../types";
import { Account } from "../entity/Account";
import { Consumable, ConsumableDto } from "../entity/Consumable";
import { Foodstuff } from "../entity/Foodstuff";
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
    await last.save();
  }

  return meal.toDto();
};

/**
 * Removes an entity with specified ID from entity linked list and re-links the broken linked list.
 */
const unlink = async (entity: Consumable | Meal) => {
  const previous = await entity.previous;
  const nextId = entity.nextId;

  entity.nextId = null;
  await entity.save();

  if (previous !== undefined) {
    previous.nextId = nextId;
    await previous.save();
  }

  await entity.reload();
};

/**
 * Validates consume request body.
 */
// prettier-ignore
const consumeDtoValidator = deviate().object().shape({
  mealId: deviate().string().guid(),
  foodstuffId: deviate().string().guid(),
  quantity: deviate().number().gt(0)
})

/**
 * Consume request data transfer object type.
 */
type ConsumeDto = Success<typeof consumeDtoValidator>;

/**
 * Adds a consumable to specified meal with specified quantity of specified
 * foodstuff.
 */
const consume = async (
  { mealId, foodstuffId, quantity }: ConsumeDto,
  account: Account
) => {
  const meal = await Meal.findOne(mealId);

  if (meal === undefined) {
    throw createIdNotFoundError(mealId, Meal.name, ["mealId"]);
  } else if (meal.accountId !== account.id) {
    throw new ForbiddenError("You are not allowed to modify this meal.");
  }

  const foodstuff = await Foodstuff.findOne(foodstuffId);

  if (foodstuff === undefined) {
    throw createIdNotFoundError(foodstuffId, Foodstuff.name, ["foodstuffId"]);
  }

  let consumable = await Consumable.findOne({ meal, foodstuff });

  if (consumable !== undefined) {
    consumable.quantity = quantity;
    await consumable.save();
  } else {
    // Previous consumable does not exist. In which case create a new one and
    // link the currently last consumable in the order with created consumable.

    const last = await Consumable.findOne({ meal, nextId: null });

    consumable = await Consumable.create({
      meal,
      foodstuff,
      quantity
    }).save();

    if (last !== undefined) {
      last.nextId = consumable.id;
      await last.save();
    }
  }

  return consumable.toDto();
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
 * Validates move meal request body.
 */
// prettier-ignore
const moveMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  date: deviate().string().append(validDate),
  nextId: deviate().optional().string().guid()
})

/**
 * Move meal request data transfer object type.
 */
type MoveMealDto = Success<typeof moveMealDtoValidator>;

/**
 * Changes meal order by moving meal with with ID `id` to a specified `date` in
 * front of meal with ID `nextId`. If `nextId` is `undefined`, then meal is
 * moved to the back and will be the last at that date.
 *
 * Returns all meals with same date as meals with IDS `id` and `nextId` with
 * updated order.
 */
const move = async ({ id, date, nextId }: MoveMealDto, account: Account) => {
  const meal = await Meal.findOne({ id });
  const next =
    nextId !== undefined ? await Meal.findOne({ id: nextId, date }) : undefined;

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
  }

  meal.date = date;
  await meal.save();

  return true as const;
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
 * Validates unconsume request body.
 */
// prettier-ignore
const unconsumeDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
})

/**
 * Unconsume request data transfer object type.
 */
type UnconsumeDto = Success<typeof unconsumeDtoValidator>;

/**
 * Removes consumable with specified `ID`.
 */
const unconsume = async ({ id }: UnconsumeDto, account: Account) => {
  const consumable = await Consumable.findOne(id, { relations: ["meal"] });

  if (consumable === undefined) {
    throw createIdNotFoundError(id, Consumable.name, ["id"]);
  } else if (consumable.meal.accountId !== account.id) {
    throw new ForbiddenError("You are not allowed to remove this consumable.");
  }

  await unlink(consumable);
  await consumable.remove();

  return true as const;
};

/**
 * Defines the request and response message body types of meal router endpoints.
 */
export interface MealController {
  add: Query<AddMealDto, MealDto>;
  consume: Query<ConsumeDto, ConsumableDto>;
  get: Query<GetMealsDto, MealDto[]>;
  move: Query<MoveMealDto, true>;
  remove: Query<RemoveMealDto, true>;
  unconsume: Query<UnconsumeDto, true>;
}

/**
 * Router which endpoints manage the invitation entities.
 */
export const mealRouter = new Router();

// Define all meal controller endpoints.
define(mealRouter, "meal", "add", addMealDtoValidator, add);
define(mealRouter, "meal", "consume", consumeDtoValidator, consume);
define(mealRouter, "meal", "get", getMealsDtoValidator, get);
define(mealRouter, "meal", "move", moveMealDtoValidator, move);
define(mealRouter, "meal", "remove", removeMealDtoValidator, remove);
define(mealRouter, "meal", "unconsume", unconsumeDtoValidator, unconsume);
