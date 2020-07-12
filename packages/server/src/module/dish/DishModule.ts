import { Module } from "@nestjs/common";

import { DishController } from "./DishController";
import { DishService } from "./DishService";

@Module({
  providers: [DishService],
  controllers: [DishController],
})
export class DishModule {}
