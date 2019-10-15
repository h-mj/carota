import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { BadRequestError } from "../../error/BadRequestError";
import { InvalidIdError } from "../../error/InvalidIdError";
import { CreateMealDto } from "./dto/CreateMealDto";
import { DeleteMealDto } from "./dto/DeleteMealDto";
import { GetAllMealsDto } from "./dto/GetAllMealsDto";
import { InsertMealDto } from "./dto/InsertMealDto";
import { RenameMealDto } from "./dto/RenameMealDto";
import { Meal } from "./Meal";
import { MealRepository } from "./MealRepository";

@Injectable()
export class MealService {
  @Transaction()
  public async create(
    dto: CreateMealDto,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const last = await mealRepository!.findOne({
      accountId: dto.accountId,
      date: dto.date,
      nextId: null
    });

    const template = mealRepository!.create({
      accountId: dto.accountId,
      name: dto.name,
      date: dto.date
    });

    return mealRepository!.link(
      await mealRepository!.save(template),
      dto.date,
      last
    );
  }

  @Transaction()
  public async delete(
    dto: DeleteMealDto,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.id);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["id"]);
    }

    await mealRepository!.unlink(meal);
    await mealRepository!.remove(meal);
  }

  @Transaction()
  public async getAll(
    dto: GetAllMealsDto,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    return mealRepository!.ordered(dto.accountId, dto.date);
  }

  @Transaction()
  public async insert(
    dto: InsertMealDto,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.id);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["id"]);
    }

    await mealRepository!.unlink(meal);

    const order = await mealRepository!.ordered(meal.accountId, dto.date);

    if (!(dto.index in order) && dto.index !== order.length) {
      throw new BadRequestError("Provided insertion index is invalid.", {
        location: { part: "body", path: ["index"] },
        reason: "invalidIndex"
      });
    }

    const previous = order[dto.index - 1];
    const next = order[dto.index];

    return mealRepository!.link(meal, dto.date, previous, next);
  }

  @Transaction()
  public async rename(
    dto: RenameMealDto,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.id);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["id"]);
    }

    meal.name = dto.name;
    await mealRepository!.save(meal);

    return meal;
  }
}
