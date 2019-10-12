import { Body, Controller, Post, UsePipes } from "@nestjs/common";

import { InvalidCredentialsError } from "../../error/InvalidCredentialsError";
import { ValidationPipe } from "../../ValidationPipe";
import { AuthenticationService } from "./AuthenticationService";
import {
  GenerateAuthenticationTokenDto,
  generateAuthenticationTokenDtoValidator
} from "./dto/GenerateAuthenticationToken";

@Controller("authentication")
export class AuthenticationController {
  public constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post("generateToken")
  @UsePipes(new ValidationPipe(generateAuthenticationTokenDtoValidator))
  public async generateToken(@Body() dto: GenerateAuthenticationTokenDto) {
    const account = await this.authenticationService.authenticate(
      dto.email,
      dto.password
    );

    if (account === undefined) {
      throw new InvalidCredentialsError(["email"], ["password"]);
    }

    return {
      account: account.toDto(),
      token: this.authenticationService.generateToken(account)
    };
  }
}
