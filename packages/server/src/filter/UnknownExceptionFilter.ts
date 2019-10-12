import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

import { InternalServerErrorError } from "../error/InternalServerErrorError";
import { ErrorResponder } from "./ErrorResponder";

@Catch()
export class UnknownExceptionFilter extends ErrorResponder
  implements ExceptionFilter<unknown> {
  public catch(_: unknown, host: ArgumentsHost) {
    this.respond(new InternalServerErrorError(), host);
  }
}
