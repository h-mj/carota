import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../error/InvalidIdError";
import { UniqueConstraintError } from "../../error/UniqueConstraintErrors";
import { authorize } from "../../utility/authorization";
import { Account } from "../account/Account";
import { Dish } from "../dish/Dish";
import { Meal } from "../meal/Meal";
import { DeleteFoodstuffDto } from "./dto/DeleteFoodstuffDto";
import { FindFoodstuffByBarcode } from "./dto/FindFoodstuffByBarcodeDto";
import { GetLatestFrequentFoodstuffDto } from "./dto/GetLatestFrequentFoodstuffDto";
import { SaveFoodstuffDto } from "./dto/SaveFoodstuffDto";
import { SearchFoodstuffDto } from "./dto/SearchFoodstuffDto";
import { Foodstuff } from "./Foodstuff";
import { FoodstuffRepository } from "./FoodstuffRepository";

@Injectable()
export class FoodstuffService {
  @Transaction()
  public async delete(
    dto: DeleteFoodstuffDto,
    principal: Account,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository
  ) {
    const foodstuff = await foodstuffRepository!.findOne(dto.id);

    if (foodstuff === undefined) {
      throw new InvalidIdError(Foodstuff, ["id"]);
    }

    authorize(principal, "delete", foodstuff);

    foodstuffRepository!.remove(foodstuff);
  }

  @Transaction()
  public async findByBarcode(
    dto: FindFoodstuffByBarcode,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository
  ) {
    return foodstuffRepository!.findOne({ barcode: dto.barcode });
  }

  @Transaction()
  public async getLatestFrequent(
    dto: GetLatestFrequentFoodstuffDto,
    principal: Account,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository
  ) {
    return foodstuffRepository!
      .createQueryBuilder()
      .innerJoin(Dish, "Dish", '"Foodstuff"."id" = "Dish"."foodstuffId"')
      .innerJoin(
        Meal,
        "Meal",
        '"Dish"."mealId" = "Meal"."id" and "Meal"."accountId" = :id and "Meal"."name" = :name and "Meal"."date" >= current_date - \'28 days\'::interval',
        { id: principal.id, name: dto.name }
      )
      .groupBy('"Foodstuff"."id"')
      .having("count(*) >= 3")
      .orderBy("count(*)", "DESC")
      .limit(32)
      .getMany();
  }

  @Transaction()
  public async save(
    dto: SaveFoodstuffDto,
    principal: Account,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository
  ) {
    let previous: Foodstuff | undefined;

    if (dto.id !== undefined) {
      previous = await foodstuffRepository!.findOne(dto.id);

      if (previous === undefined) {
        throw new InvalidIdError(Foodstuff, ["id"]);
      }

      authorize(principal, "save", previous);
    }

    if (
      dto.barcode !== undefined &&
      (previous === undefined || previous.barcode !== dto.barcode) &&
      (await foodstuffRepository!.findOne({ barcode: dto.barcode }))
    ) {
      throw new UniqueConstraintError(["barcode"]);
    }

    const template = foodstuffRepository!.create({
      id: dto.id,
      name: dto.name,
      barcode: dto.barcode,
      unit: dto.unit,
      pieceQuantity: dto.pieceQuantity,
      packageSize: dto.packageSize,
      nutritionDeclaration: dto.nutritionDeclaration,
      editor: principal
    });

    return foodstuffRepository!.save(template);
  }

  @Transaction()
  public async search(
    dto: SearchFoodstuffDto,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository
  ) {
    return await foodstuffRepository!
      .createQueryBuilder()
      .where("name ilike all (array[:...patterns])", {
        patterns: dto.query
          .trim()
          .split(/ +/)
          .map(string => `%${string}%`)
      })
      .orWhere("barcode = :barcode", { barcode: dto.query })
      .limit(32)
      .getMany();
  }
}
