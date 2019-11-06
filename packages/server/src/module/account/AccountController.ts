import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { AuthenticationService } from "../authentication/AuthenticationService";
import { Account } from "./Account";
import { AccountService } from "./AccountService";
import {
  CreateAccountDto,
  createAccountDtoValidator
} from "./dto/CreateAccountDto";
import { GetAccountDto, getAccountDtoValidator } from "./dto/GetAccountDto";
import {
  SetAccountLanguageDto,
  setAccountLanguageDtoValidator
} from "./dto/SetAccountLanguageDto";

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
      account: await account.toDto(),
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

  @Post("getCurrent")
  public async getCurrent(_: unknown, @Principal() principal: Account) {
    return principal.toDto();
  }

  @Post("setLanguage")
  public async setLanguage(
    @Body(new ValidationPipe(setAccountLanguageDtoValidator))
    dto: SetAccountLanguageDto,
    @Principal() principal: Account
  ) {
    await this.accountService.setLanguage(dto, principal);

    return true as const;
  }
}
