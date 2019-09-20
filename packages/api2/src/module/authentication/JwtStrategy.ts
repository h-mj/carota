import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AccountService } from "../account/AccountService";
import { Payload } from "./interface/Payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly accountsService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET
    });
  }

  async validate(payload: Payload) {
    return this.accountsService.getById(payload.id);
  }
}
