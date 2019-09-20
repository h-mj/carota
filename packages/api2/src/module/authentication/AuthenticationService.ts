import { compare } from "bcryptjs";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AccountService } from "../account/AccountService";
import { Account } from "../account/entity/Account";
import { Payload } from "./interface/Payload";

@Injectable()
export class AuthenticationService {
  public constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountsService: AccountService,
    private readonly jwtService: JwtService
  ) {}

  public async authenticate(email: string, password: string) {
    const account = await this.accountsService.getByEmail(email);

    if (account === undefined || !(await compare(password, account.hash))) {
      return undefined;
    }

    return account;
  }

  public async generateToken(account: Account) {
    const payload: Payload = { id: account.id };

    return { token: this.jwtService.sign(payload) };
  }
}
