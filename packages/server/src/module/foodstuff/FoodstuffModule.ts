import { Module } from "@nestjs/common";

import { FoodstuffController } from "./FoodstuffController";
import { FoodstuffService } from "./FoodstuffService";

@Module({
  providers: [FoodstuffService],
  controllers: [FoodstuffController],
})
export class FoodstuffModule {}
