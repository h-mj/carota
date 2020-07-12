import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account, authorize as authorizeAccount } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";
import { DeleteMeasurementDto } from "./dto/DeleteMeasurementDto";
import { GetQuantityMeasurementsDto } from "./dto/GetQuantityMeasurementsDto";
import { SaveMeasurementDto } from "./dto/SaveMeasurementDto";
import { authorize as authorizeMeal, Measurement } from "./Measurement";
import { MeasurementRepository } from "./MeasurementRepository";

@Injectable()
export class MeasurementService {
  @Transaction()
  public async delete(
    dto: DeleteMeasurementDto,
    principal: Account,
    @TransactionRepository() measurementRepository?: MeasurementRepository
  ) {
    const measurement = await measurementRepository!.findOne(dto.id);

    if (measurement === undefined) {
      throw new InvalidIdError(Measurement, ["id"]);
    }

    await authorizeMeal(principal, "delete", measurement);

    measurementRepository!.remove(measurement);
  }

  @Transaction()
  public async getOfQuantity(
    dto: GetQuantityMeasurementsDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository,
    @TransactionRepository() measurementRepository?: MeasurementRepository
  ) {
    const account =
      dto.accountId !== undefined
        ? await accountRepository!.findOne(dto.accountId)
        : principal;

    if (account === undefined) {
      throw new InvalidIdError(Account, ["accountId"]);
    }

    await authorizeAccount(principal, "get measurements of", account);

    return measurementRepository!.find({
      where: {
        accountId: account.id,
        quantity: dto.quantity,
      },
      order: { date: "DESC" },
    });
  }

  @Transaction()
  public async save(
    dto: SaveMeasurementDto,
    principal: Account,
    @TransactionRepository() measurementRepository?: MeasurementRepository
  ) {
    let measurement = await measurementRepository!.findOne({
      accountId: principal.id,
      quantity: dto.quantity,
      date: dto.date,
    });

    if (measurement === undefined) {
      measurement = measurementRepository!.create({
        accountId: principal.id,
        quantity: dto.quantity,
        date: dto.date,
      });
    }

    measurement.value = dto.value;

    return measurementRepository!.save(measurement);
  }
}
