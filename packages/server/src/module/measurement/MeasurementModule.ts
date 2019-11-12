import { Module } from "@nestjs/common";

import { MeasurementController } from "./MeasurementController";
import { MeasurementService } from "./MeasurementService";

@Module({
  providers: [MeasurementService],
  controllers: [MeasurementController]
})
export class MeasurementModule {}
