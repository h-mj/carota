import { Module } from "@nestjs/common";

import { AuthenticationController } from "./AuthenticationController";
import { AuthenticationService } from "./AuthenticationService";

@Module({
  providers: [AuthenticationService],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
