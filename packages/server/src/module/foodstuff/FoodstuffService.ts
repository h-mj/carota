import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../error/InvalidIdError";
import { authorize } from "../../utility/authorization";
import { Account } from "../account/Account";
import { DeleteFoodstuffDto } from "./dto/DeleteFoodstuffDto";
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
  public async save(
    dto: SaveFoodstuffDto,
    principal: Account,
    @TransactionRepository() foodstuffRepository?: FoodstuffRepository
  ) {
    if (dto.id !== undefined) {
      const foodstuff = await foodstuffRepository!.findOne(dto.id);

      if (foodstuff === undefined) {
        throw new InvalidIdError(Foodstuff, ["id"]);
      }

      authorize(principal, "save", foodstuff);
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
      .limit(32)
      .getMany();
  }
}
