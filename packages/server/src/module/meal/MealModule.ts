import { Module } from "@nestjs/common";

import { MealController } from "./MealController";
import { MealService } from "./MealService";

@Module({
  providers: [MealService],
  controllers: [MealController],
})
export class MealModule {}
