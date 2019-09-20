import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AccountModule } from "../account/AccountModule";
import { AuthenticationController } from "./AuthenticationController";
import { AuthenticationService } from "./AuthenticationService";
import { JwtStrategy } from "./JwtStrategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({ secret: process.env.SECRET }),
    forwardRef(() => AccountModule)
  ],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
