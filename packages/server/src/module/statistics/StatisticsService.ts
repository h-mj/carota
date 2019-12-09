import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";
import {
  RequiredNutrient,
  REQUIRED_NUTRIENTS
} from "../foodstuff/NutritionDeclaration";
import { authorize as authorizeMeal } from "../meal/Meal";
import { MealRepository } from "../meal/MealRepository";
import {
  authorize as authorizeMeasurement,
  MeasurementDto,
  Quantity,
  QUANTITIES
} from "../measurement/Measurement";
import { MeasurementRepository } from "../measurement/MeasurementRepository";
import { GetAllStatisticsDto } from "./dto/GetAllStatisticsDto";

interface NutritionDataSet {
  type: "nutrition";
  name: RequiredNutrient;
  data: Array<{ date: string; value: number; limit: number }>;
}

interface QuantityDataSet {
  type: "quantity";
  name: Quantity;
  data: MeasurementDto[];
}

@Injectable()
export class StatisticsService {
  @Transaction()
  public async getAll(
    dto: GetAllStatisticsDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository,
    @TransactionRepository() mealRepository?: MealRepository,
    @TransactionRepository() measurementRepository?: MeasurementRepository
  ) {
    const account =
      dto.accountId !== undefined
        ? await accountRepository!.findOne(dto.accountId)
        : principal;

    if (account === undefined) {
      throw new InvalidIdError(Account, ["accountId"]);
    }

    // prettier-ignore
    await authorizeMeasurement(principal, "get quantity measurements of", account);
    await authorizeMeal(principal, "get all meals of", account);

    const meals = await Promise.all(
      (
        await mealRepository!.find({
          where: { accountId: account.id },
          relations: ["dishes", "dishes.foodstuff"]
        })
      ).map(meal => meal.toDto(principal))
    );

    const nutrientCounters = new Map<RequiredNutrient, Map<string, number>>([
      ["energy", new Map()],
      ["protein", new Map()],
      ["fat", new Map()],
      ["carbohydrate", new Map()]
    ]);

    for (const meal of meals) {
      for (const nutrient of REQUIRED_NUTRIENTS) {
        const nutrientCounter = nutrientCounters.get(nutrient)!;

        nutrientCounter.set(
          meal.date,
          (nutrientCounter.get(meal.date) || 0) +
            meal.dishes.reduce(
              (sum, dish) =>
                sum +
                dish.quantity * dish.foodstuff.nutritionDeclaration[nutrient],
              0
            )
        );
      }
    }

    const nutritionDataSet: NutritionDataSet[] = [];

    for (const nutrient of REQUIRED_NUTRIENTS) {
      const values = nutrientCounters.get(nutrient)!;
      const counts = Array.from(values.entries()).sort(
        (entry1, entry2) =>
          new Date(entry1[0]).valueOf() - new Date(entry2[0]).valueOf()
      );

      nutritionDataSet.push({
        type: "nutrition",
        name: nutrient,
        data: counts.map(([date, value]) => ({
          date,
          value,
          limit: value - 10
        })) // TODO: Retrieve correct limit
      });
    }

    const measurements = await Promise.all(
      (
        await measurementRepository!.find({
          where: { accountId: account.id },
          order: { date: "ASC" }
        })
      ).map(measurement => measurement.toDto())
    );

    const quantityDataSet: QuantityDataSet[] = QUANTITIES.map(quantity => ({
      type: "quantity",
      name: quantity,
      data: []
    }));

    for (const measurement of measurements) {
      quantityDataSet[QUANTITIES.indexOf(measurement.quantity)].data.push(
        measurement
      );
    }

    return ([] as Array<NutritionDataSet | QuantityDataSet>).concat(
      nutritionDataSet,
      quantityDataSet
    );
  }
}
