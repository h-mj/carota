import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { Account } from "../account/Account";
import { CreateMealDto, createMealDtoValidator } from "./dto/CreateMealDto";
import { DeleteMealDto, deleteMealDtoValidator } from "./dto/DeleteMealDto";
import { GetAllMealsDto, getAllMealsDtoValidator } from "./dto/GetAllMealsDto";
import { InsertMealDto, insertMealDtoValidator } from "./dto/InsertMealDto";
import { RenameMealDto, renameMealDtoValidator } from "./dto/RenameMealDto";
import { MealService } from "./MealService";

@Controller("meal")
export class MealController {
  public constructor(private readonly mealService: MealService) {}

  @Post("create")
  public async create(
    @Body(new ValidationPipe(createMealDtoValidator)) dto: CreateMealDto,
    @Principal() principal: Account
  ) {
    const meal = await this.mealService.create(dto, principal);

    return meal.toDto(principal);
  }

  @Post("delete")
  public async delete(
    @Body(new ValidationPipe(deleteMealDtoValidator)) dto: DeleteMealDto,
    @Principal() principal: Account
  ) {
    await this.mealService.delete(dto, principal);

    return true as const;
  }

  @Post("getAll")
  public async getAll(
    @Body(new ValidationPipe(getAllMealsDtoValidator)) dto: GetAllMealsDto,
    @Principal() principal: Account
  ) {
    const meals = await this.mealService.getAll(dto, principal);

    return Promise.all(meals.map((meal) => meal.toDto(principal)));
  }

  @Post("insert")
  public async insert(
    @Body(new ValidationPipe(insertMealDtoValidator)) dto: InsertMealDto,
    @Principal() principal: Account
  ) {
    await this.mealService.insert(dto, principal);

    return true as const;
  }

  @Post("rename")
  public async rename(
    @Body(new ValidationPipe(renameMealDtoValidator)) dto: RenameMealDto,
    @Principal() principal: Account
  ) {
    await this.mealService.rename(dto, principal);

    return true as const;
  }
}
