import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes
} from "@nestjs/common";

import { AuthenticationService } from "./AuthenticationService";
import {
  GenerateAuthenticationTokenDto,
  generateAuthenticationTokenDtoValidationPipe
} from "./dto/GenerateAuthenticationTokenDto";

@Controller("auth")
export class AuthenticationController {
  public constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post("generateToken")
  @UsePipes(generateAuthenticationTokenDtoValidationPipe)
  public async token(@Body() generateTokenDto: GenerateAuthenticationTokenDto) {
    const account = await this.authenticationService.authenticate(
      generateTokenDto.email,
      generateTokenDto.password
    );

    if (account === undefined) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.authenticationService.generateToken(account);
  }
}
