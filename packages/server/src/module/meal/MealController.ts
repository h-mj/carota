import { Body, Controller, Post } from "@nestjs/common";

import { ValidationPipe } from "../../ValidationPipe";
import { CreateMealDto, createMealDtoValidator } from "./dto/CreateMealDto";
import { DeleteMealDto, deleteMealDtoValidator } from "./dto/DeleteMealDto";
import { GetAllMealsDto, getAllMealsDtoValidator } from "./dto/GetAllMealsDto";
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
}
