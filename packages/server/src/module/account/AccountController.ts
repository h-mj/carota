import { Body, Controller, Post, UsePipes } from "@nestjs/common";

import { ValidationPipe } from "../../ValidationPipe";
import { AuthenticationService } from "../authentication/AuthenticationService";
import { AccountService } from "./AccountService";
import {
  CreateAccountDto,
  createAccountDtoValidator
} from "./dto/CreateAccountDto";

@Controller("account")
export class AccountController {
  public constructor(
    private readonly accountService: AccountService,
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post("create")
  @UsePipes(new ValidationPipe(createAccountDtoValidator))
  public async create(@Body() dto: CreateAccountDto) {
    const account = await this.accountService.create(dto);

    return {
      account: account.toDto(),
      token: this.authenticationService.generateToken(account)
    };
  }
}
