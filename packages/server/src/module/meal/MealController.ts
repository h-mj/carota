import { Body, Controller, Post } from "@nestjs/common";

import { ValidationPipe } from "../../pipe/ValidationPipe";
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
    @Body(new ValidationPipe(createMealDtoValidator)) dto: CreateMealDto
  ) {
    const meal = await this.mealService.create(dto);

    return meal.toDto();
  }

  @Post("delete")
  public async delete(
    @Body(new ValidationPipe(deleteMealDtoValidator)) dto: DeleteMealDto
  ) {
    await this.mealService.delete(dto);

    return true as const;
  }

  @Post("getAll")
  public async getAll(
    @Body(new ValidationPipe(getAllMealsDtoValidator)) dto: GetAllMealsDto
  ) {
    const meals = await this.mealService.getAll(dto);

    return meals.map(meal => meal.toDto());
  }

  @Post("insert")
  public async insert(
    @Body(new ValidationPipe(insertMealDtoValidator)) dto: InsertMealDto
  ) {
    await this.mealService.insert(dto);

    return true as const;
  }

  @Post("rename")
  public async rename(
    @Body(new ValidationPipe(renameMealDtoValidator)) dto: RenameMealDto
  ) {
    await this.mealService.rename(dto);

    return true as const;
  }
}
