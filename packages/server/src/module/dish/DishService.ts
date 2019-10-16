import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { BadRequestError } from "../../error/BadRequestError";
import { InvalidIdError } from "../../error/InvalidIdError";
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
    @TransactionRepository() dishRepository?: DishRepository,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const meal = await mealRepository!.findOne(dto.mealId);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["mealId"]);
    }

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
    @TransactionRepository() dishRepository?: DishRepository
  ) {
    const dish = await dishRepository!.findOne(dto.id);

    if (dish === undefined) {
      throw new InvalidIdError(Dish, ["id"]);
    }

    await dishRepository!.unlink(dish);
    await dishRepository!.remove(dish);
  }

  @Transaction()
  public async insert(
    dto: InsertDishDto,
    @TransactionRepository() dishRepository?: DishRepository,
    @TransactionRepository() mealRepository?: MealRepository
  ) {
    const dish = await dishRepository!.findOne(dto.id);

    if (dish === undefined) {
      throw new InvalidIdError(Dish, ["id"]);
    }

    await dishRepository!.unlink(dish);

    const meal = await mealRepository!.findOne(dto.mealId);

    if (meal === undefined) {
      throw new InvalidIdError(Meal, ["mealId"]);
    }

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
