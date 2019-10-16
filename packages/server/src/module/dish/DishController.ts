import { Body, Controller, Post } from "@nestjs/common";

import { ValidationPipe } from "../../pipe/ValidationPipe";
import { DishService } from "./DishService";
import { CreateDishDto, createDishDtoValidator } from "./dto/CreateDishDto";
import { DeleteDishDto, deleteDishDtoValidator } from "./dto/DeleteDishDto";
import { InsertDishDto, insertDishDtoValidator } from "./dto/InsertDishDto";

@Controller("dish")
export class DishController {
  public constructor(private readonly dishService: DishService) {}

  @Post("create")
  public async create(
    @Body(new ValidationPipe(createDishDtoValidator)) dto: CreateDishDto
  ) {
    const dish = await this.dishService.create(dto);

    return dish.toDto();
  }

  @Post("delete")
  public async delete(
    @Body(new ValidationPipe(deleteDishDtoValidator)) dto: DeleteDishDto
  ) {
    await this.dishService.delete(dto);

    return true as const;
  }

  @Post("insert")
  public async insert(
    @Body(new ValidationPipe(insertDishDtoValidator)) dto: InsertDishDto
  ) {
    await this.dishService.insert(dto);

    return true as const;
  }
}
