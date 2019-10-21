import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../middleware/AuthenticationMiddleware";
import { ValidationPipe } from "../../pipe/ValidationPipe";
import { Account } from "../account/Account";
import {
  DeleteFoodstuffDto,
  deleteFoodstuffDtoValidator
} from "./dto/DeleteFoodstuffDto";
import {
  SaveFoodstuffDto,
  saveFoodstuffDtoValidator
} from "./dto/SaveFoodstuffDto";
import {
  SearchFoodstuffDto,
  searchFoodstuffDtoValidator
} from "./dto/SearchFoodstuffDto";
import { FoodstuffService } from "./FoodstuffService";

@Controller("foodstuff")
export class FoodstuffController {
  public constructor(private readonly foodstuffService: FoodstuffService) {}

  @Post("delete")
  public async delete(
    @Body(new ValidationPipe(deleteFoodstuffDtoValidator))
    dto: DeleteFoodstuffDto,
    @Principal() principal: Account
  ) {
    await this.foodstuffService.delete(dto, principal);

    return true as const;
  }

  @Post("save")
  public async save(
    @Body(new ValidationPipe(saveFoodstuffDtoValidator)) dto: SaveFoodstuffDto,
    @Principal() principal: Account
  ) {
    const foodstuff = await this.foodstuffService.save(dto, principal);

    return foodstuff.toDto();
  }

  @Post("search")
  public async search(
    @Body(new ValidationPipe(searchFoodstuffDtoValidator))
    dto: SearchFoodstuffDto
  ) {
    const foodstuffs = await this.foodstuffService.search(dto);

    return foodstuffs.map(foodstuff => foodstuff.toDto());
  }
}
