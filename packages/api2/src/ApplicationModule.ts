import { join } from "path";

import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccountModule } from "./module/account/AccountModule";
import { AuthenticationModule } from "./module/authentication/AuthenticationModule";
import { InvitationModule } from "./module/invitation/InvitationModule";

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, "..", "public") }),
    TypeOrmModule.forRoot(),
    AccountModule,
    AuthenticationModule,
    InvitationModule
  ]
})
export class ApplicationModule {}
