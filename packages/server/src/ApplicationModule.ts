import { join } from "path";

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthenticationMiddleware } from "./base/AuthenticationMiddleware";
import { AccountModule } from "./module/account/AccountModule";
import { AuthenticationModule } from "./module/authentication/AuthenticationModule";
import { DishModule } from "./module/dish/DishModule";
import { FoodstuffModule } from "./module/foodstuff/FoodstuffModule";
import { GroupModule } from "./module/group/GroupModule";
import { InvitationModule } from "./module/invitation/InvitationModule";
import { MealModule } from "./module/meal/MealModule";
import { MeasurementModule } from "./module/measurement/MeasurementModule";
import { StatisticsModule } from "./module/statistics/StatisticsModule";

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, "..", "public") }),
    TypeOrmModule.forRoot(),
    AccountModule,
    AuthenticationModule,
    DishModule,
    FoodstuffModule,
    GroupModule,
    InvitationModule,
    MealModule,
    MeasurementModule,
    StatisticsModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes("*");
  }
}
