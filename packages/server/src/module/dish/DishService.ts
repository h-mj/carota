import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { BadRequestError } from "../../error/BadRequestError";
import { ForbiddenError } from "../../error/ForbiddenError";
import { InvalidIdError } from "../../error/InvalidIdError";
import { authorize } from "../../utility/authorization";
import { Account } from "../account/Account";
import { Foodstuff } from "../foodstuff/Foodstuff";
import { FoodstuffRepository } from "../foodstuff/FoodstuffRepository";
import { Meal } from "../meal/Meal";
import { MealRepository } from "../meal/MealRepository";
import { Dish } from "./Dish";
import { DishRepository } from "./DishRepository";
import { CreateDishDto } from "./dto/CreateDishDto";
import { DeleteDishDto } from "./dto/DeleteDishDto";
import { InsertDishDto } from "./dto/InsertDishDto";

@Injectable()
export class DishService {
  @Transaction()
  public async create(
    dto: CreateDishDto,
    principal: Account,
    @TransactionRepository() dishRepository?: DishRepository,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.mealId);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["mealId"]);
    }

    authorize(principal, "add dish to", meal);

    const foodstuff = await foodstuffRepository!.findOne(dto.foodstuffId);

    if (foodstuff === undefined) {
      throw new InvalidIdError(Foodstuff, ["foodstuffId"]);
    }

    const last = await dishRepository!.findOne({
      meal,
      nextId: null
    });

    const template = dishRepository!.create({
      meal,
      foodstuff,
      quantity: dto.quantity
    });

    return dishRepository!.link(
      await dishRepository!.save(template),
      meal,
      last
    );
  }

  @Transaction()
  public async delete(
    dto: DeleteDishDto,
    principal: Account,
    @TransactionRepository() dishRepository?: DishRepository
  ) {
    const dish = await dishRepository!.findOne(dto.id, { relations: ["meal"] });

    if (dish === undefined) {
      throw new InvalidIdError(Dish, ["id"]);
    }

    authorize(principal, "delete", dish);

    await dishRepository!.unlink(dish);
    await dishRepository!.remove(dish);
  }

  @Transaction()
  public async insert(
    dto: InsertDishDto,
    principal: Account,
    @TransactionRepository() dishRepository?: DishRepository,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const dish = await dishRepository!.findOne(dto.id, { relations: ["meal"] });

    if (dish === undefined) {
      throw new InvalidIdError(Dish, ["id"]);
    }

    const meal = await mealRepository!.findOne(dto.mealId);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["mealId"]);
    } else if (dish.meal!.accountId !== meal.accountId) {
      throw new ForbiddenError(
        "Meal can only be inserted into a meal with the same owner."
      );
    }

    authorize(principal, "insert dish into", meal);

    await dishRepository!.unlink(dish);

    const dishes = await dishRepository!.ordered(meal);

    if (!(dto.index in dishes) && dto.index !== dishes.length) {
      throw new BadRequestError("Provided insertion index is invalid.", {
        location: { part: "body", path: ["index"] },
        reason: "invalidIndex"
      });
    }

    const previous = dishes[dto.index - 1];
    const next = dishes[dto.index];

    return dishRepository!.link(dish, meal, previous, next);
  }
}
