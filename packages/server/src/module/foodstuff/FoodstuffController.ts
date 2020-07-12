import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { Account } from "../account/Account";
import {
  DeleteFoodstuffDto,
  deleteFoodstuffDtoValidator,
} from "./dto/DeleteFoodstuffDto";
import {
  FindFoodstuffByBarcode,
  findFoodstuffByBarcodeValidator,
} from "./dto/FindFoodstuffByBarcodeDto";
import {
  GetLatestFrequentFoodstuffDto,
  getLatestFrequentFoodstuffDtoValidator,
} from "./dto/GetLatestFrequentFoodstuffDto";
import {
  SaveFoodstuffDto,
  saveFoodstuffDtoValidator,
} from "./dto/SaveFoodstuffDto";
import {
  SearchFoodstuffDto,
  searchFoodstuffDtoValidator,
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

  @Post("findByBarcode")
  public async findByBarcode(
    @Body(new ValidationPipe(findFoodstuffByBarcodeValidator))
    dto: FindFoodstuffByBarcode,
    @Principal() principal: Account
  ) {
    const foodstuff = await this.foodstuffService.findByBarcode(dto);

    return foodstuff === undefined ? undefined : foodstuff.toDto(principal);
  }

  @Post("getLatestFrequent")
  public async getLatestFrequent(
    @Body(new ValidationPipe(getLatestFrequentFoodstuffDtoValidator))
    dto: GetLatestFrequentFoodstuffDto,
    @Principal() principal: Account
  ) {
    const foodstuffs = await this.foodstuffService.getLatestFrequent(
      dto,
      principal
    );

    return Promise.all(
      foodstuffs.map((foodstuff) => foodstuff.toDto(principal))
    );
  }

  @Post("save")
  public async save(
    @Body(new ValidationPipe(saveFoodstuffDtoValidator)) dto: SaveFoodstuffDto,
    @Principal() principal: Account
  ) {
    const foodstuff = await this.foodstuffService.save(dto, principal);

    return foodstuff.toDto(principal);
  }

  @Post("search")
  public async search(
    @Body(new ValidationPipe(searchFoodstuffDtoValidator))
    dto: SearchFoodstuffDto,
    @Principal() principal: Account
  ) {
    const foodstuffs = await this.foodstuffService.search(dto);

    return Promise.all(
      foodstuffs.map((foodstuff) => foodstuff.toDto(principal))
    );
  }
}
