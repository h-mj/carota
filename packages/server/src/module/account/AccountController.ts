import { Body, Controller, Post } from "@nestjs/common";

import { Principal } from "../../base/AuthenticationMiddleware";
import { ValidationPipe } from "../../base/ValidationPipe";
import { AuthenticationService } from "../authentication/AuthenticationService";
import { Account } from "./Account";
import { AccountService } from "./AccountService";
import {
  CreateAccountDto,
  createAccountDtoValidator,
} from "./dto/CreateAccountDto";
import { GetAccountDto, getAccountDtoValidator } from "./dto/GetAccountDto";
import {
  InsertAccountDto,
  insertAccountDtoValidator,
} from "./dto/InsertAccountDto";
import {
  SetAccountLanguageDto,
  setAccountLanguageDtoValidator,
} from "./dto/SetAccountLanguageDto";

/**
 * Controller that defines all endpoints related to `Account` entity.
 */
@Controller("account")
export class AccountController {
  /**
   * Creates a new instance of `AccountController`. This constructor is only
   * called by Nest.
   */
  public constructor(
    private readonly accountService: AccountService,
    private readonly authenticationService: AuthenticationService
  ) {}

  /**
   * Account creation endpoint.
   */
  @Post("create")
  public async create(
    @Body(new ValidationPipe(createAccountDtoValidator)) dto: CreateAccountDto
  ) {
    const account = await this.accountService.create(dto);

    return {
      account: await account.toDto(),
      token: this.authenticationService.generateToken(account),
    };
  }

  /**
   * Account retrieval endpoint.
   */
  @Post("get")
  public async get(
    @Body(new ValidationPipe(getAccountDtoValidator)) dto: GetAccountDto,
    @Principal() principal: Account
  ) {
    const account = await this.accountService.get(dto, principal);

    return account.toDto();
  }

  /**
   * Current account creation endpoint.
   */
  @Post("getCurrent")
  public async getCurrent(_: unknown, @Principal() principal: Account) {
    return principal.toDto();
  }

  /**
   * Account into group insertion endpoint.
   */
  @Post("insert")
  public async insert(
    @Body(new ValidationPipe(insertAccountDtoValidator)) dto: InsertAccountDto,
    @Principal() principal: Account
  ) {
    await this.accountService.insert(dto, principal);

    return true as const;
  }

  /**
   * Account language setting endpoint.
   */
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
