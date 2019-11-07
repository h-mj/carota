import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { BadRequestError } from "../../base/error/BadRequestError";
import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";
import { DishRepository } from "../dish/DishRepository";
import { CreateMealDto } from "./dto/CreateMealDto";
import { DeleteMealDto } from "./dto/DeleteMealDto";
import { GetAllMealsDto } from "./dto/GetAllMealsDto";
import { InsertMealDto } from "./dto/InsertMealDto";
import { RenameMealDto } from "./dto/RenameMealDto";
import { authorize, Meal } from "./Meal";
import { MealRepository } from "./MealRepository";

@Injectable()
export class MealService {
  @Transaction()
  public async create(
    dto: CreateMealDto,
    account: Account,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const last = await mealRepository!.findOne({
      account,
      date: dto.date,
      nextId: null
    });

    const template = mealRepository!.create({
      account,
      name: dto.name,
      date: dto.date
    });

    const meal = await mealRepository!.save(template);

    await mealRepository!.link(meal, dto.date, last);

    return meal;
  }

  @Transaction()
  public async delete(
    dto: DeleteMealDto,
    principal: Account,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.id);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["id"]);
    }

    await authorize(principal, "delete", meal);

    await mealRepository!.unlink(meal);
    await mealRepository!.remove(meal);
  }

  @Transaction()
  public async getAll(
    dto: GetAllMealsDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository,
    @TransactionRepository() dishRepository?: DishRepository,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const account = await accountRepository!.findOne(
      dto.accountId || principal.id
    );

    if (account === undefined) {
      throw new InvalidIdError(Account, ["accountId"]);
    }

    await authorize(principal, "get all meals of", account);

    const meals = await mealRepository!.ordered(account, dto.date);

    // TODO: fix n + 1
    for (const meal of meals) {
      meal.dishes = dishRepository!.ordered(meal);
    }

    return meals;
  }

  @Transaction()
  public async insert(
    dto: InsertMealDto,
    principal: Account,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.id);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["id"]);
    }

    await authorize(principal, "insert", meal);

    await mealRepository!.unlink(meal);

    const meals = await mealRepository!.ordered(principal, dto.date);

    if (!(dto.index in meals) && dto.index !== meals.length) {
      throw new BadRequestError("Provided insertion index is invalid.", {
        location: { part: "body", path: ["index"] },
        reason: "invalidIndex"
      });
    }

    const previous = meals[dto.index - 1];
    const next = meals[dto.index];

    await mealRepository!.link(meal, dto.date, previous, next);
  }

  @Transaction()
  public async rename(
    dto: RenameMealDto,
    principal: Account,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.id);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["id"]);
    }

    await authorize(principal, "rename", meal);

    meal.name = dto.name;
    await mealRepository!.save(meal);
  }
}
