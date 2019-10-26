import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../middleware/AuthenticationMiddleware";
import { ValidationPipe } from "../../pipe/ValidationPipe";
import { Account } from "../account/Account";
import { DishService } from "./DishService";
import { CreateDishDto, createDishDtoValidator } from "./dto/CreateDishDto";
import { DeleteDishDto, deleteDishDtoValidator } from "./dto/DeleteDishDto";
import { EatDishDto, eatDishDtoValidator } from "./dto/EatDishDto";
import { InsertDishDto, insertDishDtoValidator } from "./dto/InsertDishDto";

@Controller("dish")
export class DishController {
  public constructor(private readonly dishService: DishService) {}

  @Post("create")
  public async create(
    @Body(new ValidationPipe(createDishDtoValidator)) dto: CreateDishDto,
    @Principal() principal: Account
  ) {
    const dish = await this.dishService.create(dto, principal);

    return dish.toDto();
  }

  @Post("delete")
  public async delete(
    @Body(new ValidationPipe(deleteDishDtoValidator)) dto: DeleteDishDto,
    @Principal() principal: Account
  ) {
    await this.dishService.delete(dto, principal);

    return true as const;
  }

  @Post("eat")
  public async eat(
    @Body(new ValidationPipe(eatDishDtoValidator)) dto: EatDishDto,
    @Principal() principal: Account
  ) {
    await this.dishService.eat(dto, principal);

    return true as const;
  }

  @Post("insert")
  public async insert(
    @Body(new ValidationPipe(insertDishDtoValidator)) dto: InsertDishDto,
    @Principal() principal: Account
  ) {
    await this.dishService.insert(dto, principal);

    return true as const;
  }
}
