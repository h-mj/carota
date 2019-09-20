import { Body, Controller, Post, UsePipes } from "@nestjs/common";

import { AccountService } from "./AccountService";
import {
  CreateAccountDto,
  createAccountDtoValidationPipe
} from "./dto/CreateAccountDto";

@Controller("account")
export class AccountController {
  public constructor(private readonly accountService: AccountService) {}

  @Post("create")
  @UsePipes(createAccountDtoValidationPipe)
  public async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }
}
