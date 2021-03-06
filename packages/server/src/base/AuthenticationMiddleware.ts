import { Request, Response } from "express";

import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";

import { Account } from "../module/account/Account";
import { AuthenticationService } from "../module/authentication/AuthenticationService";
import { UnauthorizedError } from "./error/UnauthorizedError";

type AuthorizedRequest = Request & { account: Account };

export const Principal = createParamDecorator(
  (_, context: ExecutionContext) => {
    return (context.switchToHttp().getRequest() as AuthorizedRequest).account;
  }
);

@Injectable()
export class AuthenticationMiddleware
  implements NestMiddleware<Request, Response> {
  public constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  private static EXCLUDED_PATHS = [
    "/api/account/create",
    "/api/authentication/generateToken",
    "/api/invitation/get",
  ];

  public async use(request: Request, _: Response, next: () => unknown) {
    if (AuthenticationMiddleware.EXCLUDED_PATHS.includes(request.baseUrl)) {
      return next();
    }

    const header = request.header("Authorization");

    if (header === undefined) {
      throw new UnauthorizedError('Header field "Authorization" is required.', {
        location: { part: "headers", path: ["Authorization"] },
        reason: "missing",
        message: 'Header field "Authorization" is required.',
      });
    }

    const parts = header.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError(
        'Syntax of header field "Authorization" must be "Bearer <credentials>".',
        {
          location: { part: "headers", path: ["Authorization"] },
          reason: "invalid",
          message:
            'Syntax of header field "Authorization" must be "Bearer <credentials>".',
        }
      );
    }

    const account = await this.authenticationService.verifyToken(parts[1]);

    if (account === undefined) {
      throw new UnauthorizedError(
        'Token provided in header field "Authorization" is invalid.',
        {
          location: { part: "headers", path: ["Authorization"] },
          reason: "incorrect",
          message: 'Token provided in header field "Authorization" is invalid.',
        }
      );
    }

    (request as AuthorizedRequest).account = account;

    next();
  }
}
