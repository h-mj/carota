import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthenticationMiddleware } from "./AuthenticationMiddleware";
import { AccountModule } from "./module/account/AccountModule";
import { AuthenticationModule } from "./module/authentication/AuthenticationModule";
import { InvitationModule } from "./module/invitation/InvitationModule";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AccountModule,
    AuthenticationModule,
    InvitationModule
  ]
})
export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes("/*");
  }
}
