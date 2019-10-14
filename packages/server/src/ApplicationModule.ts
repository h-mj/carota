import { join } from "path";

import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthenticationMiddleware } from "./middleware/AuthenticationMiddleware";
import { AccountModule } from "./module/account/AccountModule";
import { AuthenticationModule } from "./module/authentication/AuthenticationModule";
import { FoodstuffModule } from "./module/foodstuff/FoodstuffModule";
import { InvitationModule } from "./module/invitation/InvitationModule";
import { MealModule } from "./module/meal/MealModule";

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, "..", "public") }),
    TypeOrmModule.forRoot(),
    AccountModule,
    AuthenticationModule,
    FoodstuffModule,
    InvitationModule,
    MealModule
  ]
})
export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes("*");
  }
}
