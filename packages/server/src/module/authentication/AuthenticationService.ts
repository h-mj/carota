import { compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { Transaction, TransactionRepository } from "typeorm";

import { Injectable } from "@nestjs/common";

import { Account } from "../account/Account";
import { AccountRepository } from "../account/AccountRepository";

interface Payload {
  accountId: string;
}

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

  public generateToken(account: Account) {
    const payload: Payload = { accountId: account.id };

    return sign(payload, process.env.SECRET!);
  }

  @Transaction()
  public async verifyToken(
    token: string,
    @TransactionRepository() accountRepository?: AccountRepository
  ) {
    try {
      const payload = verify(token, process.env.SECRET!) as Payload;

      return accountRepository!.findOne(payload.accountId);
    } catch (exception) {
      return undefined;
    }
  }
}
