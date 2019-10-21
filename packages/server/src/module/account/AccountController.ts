import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../middleware/AuthenticationMiddleware";
import { ValidationPipe } from "../../pipe/ValidationPipe";
import { AuthenticationService } from "../authentication/AuthenticationService";
import { Account } from "./Account";
import { AccountService } from "./AccountService";
import {
  CreateAccountDto,
  createAccountDtoValidator
} from "./dto/CreateAccountDto";
import { GetAccountDto, getAccountDtoValidator } from "./dto/GetAccountDto";

@Controller("account")
export class AccountController {
  public constructor(
    private readonly accountService: AccountService,
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post("create")
  public async create(
    @Body(new ValidationPipe(createAccountDtoValidator)) dto: CreateAccountDto
  ) {
    const account = await this.accountService.create(dto);

    return {
      account: account.toDto(),
      token: this.authenticationService.generateToken(account)
    };
  }

  @Post("get")
  public async get(
    @Body(new ValidationPipe(getAccountDtoValidator)) dto: GetAccountDto,
    @Principal() principal: Account
  ) {
    const account = await this.accountService.get(dto, principal);

    return account.toDto();
  }
}
