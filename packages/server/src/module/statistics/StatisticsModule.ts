import { Module } from "@nestjs/common";

import { StatisticsController } from "./StatisticsController";
import { StatisticsService } from "./StatisticsService";

@Module({
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
