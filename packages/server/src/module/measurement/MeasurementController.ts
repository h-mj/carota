import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { Account } from "../account/Account";
import {
  deleteMeasurementDtoValidator,
  DeleteMeasurementDto
} from "./dto/DeleteMeasurementDto";
import {
  getQuantityMeasurementsDtoValidator,
  GetQuantityMeasurementsDto
} from "./dto/GetSizeMeasurementsDto";
import {
  saveMeasurementDtoValidator,
  SaveMeasurementDto
} from "./dto/SaveMeasurementDto";
import { MeasurementService } from "./MeasurementService";

@Controller("measurement")
export class MeasurementController {
  public constructor(private readonly measurementService: MeasurementService) {}

  @Post("delete")
  public async delete(
    @Body(new ValidationPipe(deleteMeasurementDtoValidator))
    dto: DeleteMeasurementDto,
    @Principal() principal: Account
  ) {
    await this.measurementService.delete(dto, principal);

    return true as const;
  }

  @Post("getOfQuantity")
  public async getOfQuantity(
    @Body(new ValidationPipe(getQuantityMeasurementsDtoValidator))
    dto: GetQuantityMeasurementsDto,
    @Principal() principal: Account
  ) {
    const measurements = await this.measurementService.getOfQuantity(
      dto,
      principal
    );

    return Promise.all(measurements.map(measurement => measurement.toDto()));
  }

  @Post("save")
  public async save(
    @Body(new ValidationPipe(saveMeasurementDtoValidator))
    dto: SaveMeasurementDto,
    @Principal() principal: Account
  ) {
    const measurement = await this.measurementService.save(dto, principal);

    return measurement.toDto();
  }
}
