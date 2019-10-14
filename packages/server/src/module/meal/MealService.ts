import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../error/InvalidIdError";
import { CreateMealDto } from "./dto/CreateMealDto";
import { DeleteMealDto } from "./dto/DeleteMealDto";
import { GetAllMealsDto } from "./dto/GetAllMealsDto";
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

    const meal = await mealRepository!.save(template);

    if (last === undefined) {
      return meal;
    }

    meal.previousId = last.id;
    await mealRepository!.save(meal);

    last.nextId = meal.id;
    await mealRepository!.save(last);

    return meal;
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

    const previous = await meal.previous;
    const next = await meal.next;

    meal.previousId = null;
    meal.nextId = null;
    await mealRepository!.save(meal, { reload: true });

    if (previous !== undefined) {
      previous.nextId = next === undefined ? null : next.id;
      await mealRepository!.save(previous);
    }

    if (next !== undefined) {
      next.previousId = previous === undefined ? null : previous.id;
      await mealRepository!.save(next);
    }

    await mealRepository!.remove(meal);
  }

  @Transaction()
  public async getAll(
    dto: GetAllMealsDto,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    return mealRepository!.find({ accountId: dto.accountId, date: dto.date });
  }
}
