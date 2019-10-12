import { Module } from "@nestjs/common";

import { AuthenticationModule } from "../authentication/AuthenticationModule";
import { AccountController } from "./AccountController";
import { AccountService } from "./AccountService";

@Module({
  imports: [AuthenticationModule],
  providers: [AccountService],
  controllers: [AccountController]
})
export class AccountModule {}
