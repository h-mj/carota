import { Body, Controller, Post } from "@nestjs/common";

import { InvalidCredentialsError } from "../../base/error/InvalidCredentialsError";
import { ValidationPipe } from "../../base/ValidationPipe";
import { AuthenticationService } from "./AuthenticationService";
import {
  GenerateAuthenticationTokenDto,
  generateAuthenticationTokenDtoValidator,
} from "./dto/GenerateAuthenticationToken";

@Controller("authentication")
export class AuthenticationController {
  public constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post("generateToken")
  public async generateToken(
    @Body(new ValidationPipe(generateAuthenticationTokenDtoValidator))
    dto: GenerateAuthenticationTokenDto
  ) {
    const account = await this.authenticationService.authenticate(
      dto.email,
      dto.password
    );

    if (account === undefined) {
      throw new InvalidCredentialsError(["email"], ["password"]);
    }

    return {
      account: await account.toDto(),
      token: this.authenticationService.generateToken(account),
    };
  }
}
