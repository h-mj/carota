import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { InvalidIdError } from "../../base/error/InvalidIdError";
import { Account } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";
import { DeleteMeasurementDto } from "./dto/DeleteMeasurementDto";
import { GetSizeMeasurementsDto } from "./dto/GetSizeMeasurementsDto";
import { SaveMeasurementDto } from "./dto/SaveMeasurementDto";
import { authorize, Measurement } from "./Measurement";
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

    await authorize(principal, "delete", measurement);

    measurementRepository!.remove(measurement);
  }

  @Transaction()
  public async getWithSize(
    dto: GetSizeMeasurementsDto,
    principal: Account,
    @TransactionRepository() accountRepository?: AccountRepository,
    @TransactionRepository() measurementRepository?: MeasurementRepository
  ) {
    const account = await accountRepository!.findOne(
      dto.accountId || principal.id
    );

    if (account === undefined) {
      throw new InvalidIdError(Account, ["accountId"]);
    }

    await authorize(principal, "get size measurements of", account);

    return measurementRepository!.find({
      accountId: account.id,
      size: dto.size
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
      size: dto.size,
      date: dto.date
    });

    if (measurement === undefined) {
      measurement = measurementRepository!.create({
        accountId: principal.id,
        size: dto.size,
        date: dto.date
      });
    }

    measurement.value = dto.value;

    return measurementRepository!.save(measurement);
  }
}
