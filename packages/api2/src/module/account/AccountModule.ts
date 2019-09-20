import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthenticationModule } from "../authentication/AuthenticationModule";
import { InvitationModule } from "../invitation/InvitationModule";
import { AccountController } from "./AccountController";
import { AccountService } from "./AccountService";
import { Account } from "./entity/Account";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => AuthenticationModule),
    InvitationModule
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController]
})
export class AccountModule {}
