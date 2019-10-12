import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { Account } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";

@Injectable()
export class AuthenticationService {
  @Transaction()
  public async authenticate(
    email: string,
    password: string,
    @TransactionRepository() accountRepository?: AccountRepository
  ) {
    const account = await accountRepository!.findOne({ email });

    if (account === undefined || !(await compare(password, account.hash))) {
      return undefined;
    }

    return account;
  }

  public async generateToken(account: Account) {
    const payload = { accountId: account.id };

    return sign(payload, process.env.SECRET!);
  }
}
