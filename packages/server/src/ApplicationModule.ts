import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
export class ApplicationModule {}
