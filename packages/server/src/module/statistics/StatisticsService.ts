import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";
import { RequiredNutrient } from "../foodstuff/NutritionDeclaration";
import { authorize as authorizeMeal } from "../meal/Meal";
import { MealRepository } from "../meal/MealRepository";
import {
  QUANTITIES,
  Quantity,
  authorize as authorizeMeasurement
} from "../measurement/Measurement";
import { MeasurementRepository } from "../measurement/MeasurementRepository";
import { GetAllStatisticsDto } from "./dto/GetAllStatisticsDto";

interface NutritionDataPoint {
  date: string;
  value: number;
  limit: number;
}

interface NutritionDataSet {
  type: "nutrition";
  name: RequiredNutrient;
  data: NutritionDataPoint[];
}

interface QuantityDataPoint {
  date: string;
  value: number;
}

interface QuantityDataSet {
  type: "quantity";
  name: Quantity;
  data: QuantityDataPoint[];
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

    const meals = await mealRepository!.find({
      where: { accountId: account.id },
      relations: ["dishes", "dishes.foodstuff"]
    });

    const mealDtos = await Promise.all(
      meals.map(meal => meal.toDto(principal))
    );

    const counters = new Map<RequiredNutrient, Map<string, number>>([
      ["energy", new Map()],
      ["protein", new Map()],
      ["fat", new Map()],
      ["carbohydrate", new Map()]
    ]);

    for (const [nutrient, counter] of counters.entries()) {
      for (const dto of mealDtos) {
        const nutrientAmount = dto.dishes.reduce(
          (sum, dish) =>
            sum + dish.quantity * dish.foodstuff.nutritionDeclaration[nutrient],
          0
        );

        counter.set(dto.date, (counter.get(dto.date) ?? 0) + nutrientAmount);
      }
    }

    const nutritionDataSet: NutritionDataSet[] = [];

    for (const [nutrient, counter] of counters.entries()) {
      const points = Array.from(counter.entries()).sort(
        (entry1, entry2) =>
          new Date(entry1[0]).valueOf() - new Date(entry2[0]).valueOf()
      );

      nutritionDataSet.push({
        type: "nutrition",
        name: nutrient,
        data: points.map(([date, value]) => ({
          date,
          value,
          limit: value - 10
        })) // TODO: Retrieve correct limit
      });
    }

    const measurements = await measurementRepository!.find({
      where: { accountId: account.id },
      order: { date: "ASC" }
    });

    const measurementDtos = await Promise.all(
      measurements.map(measurement => measurement.toDto())
    );

    const quantityDataSet: QuantityDataSet[] = QUANTITIES.map(quantity => ({
      type: "quantity",
      name: quantity,
      data: []
    }));

    for (const dto of measurementDtos) {
      quantityDataSet[QUANTITIES.indexOf(dto.quantity)].data.push({
        date: dto.date,
        value: dto.value
      });
    }

    return ([] as Array<NutritionDataSet | QuantityDataSet>).concat(
      nutritionDataSet,
      quantityDataSet
    );
  }
}
