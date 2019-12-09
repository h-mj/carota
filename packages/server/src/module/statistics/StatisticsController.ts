import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { Account } from "../account/Account";
import {
  getAllStatisticsDtoValidator,
  GetAllStatisticsDto
} from "./dto/GetAllStatisticsDto";
import { StatisticsService } from "./StatisticsService";

@Controller("statistics")
export class StatisticsController {
  public constructor(private readonly statisticsService: StatisticsService) {}

  @Post("getAll")
  public getAll(
    @Body(new ValidationPipe(getAllStatisticsDtoValidator))
    dto: GetAllStatisticsDto,
    @Principal() principal: Account
  ) {
    return this.statisticsService.getAll(dto, principal);
  }
}
