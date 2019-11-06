import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

import { UnauthorizedError } from "../error/UnauthorizedError";
import { ErrorResponder } from "./ErrorResponder";

@Catch(UnauthorizedError)
export class UnauthorizedErrorFilter extends ErrorResponder
  implements ExceptionFilter<UnauthorizedError> {
  public catch(error: UnauthorizedError, host: ArgumentsHost) {
    this.respond(error, host, error.status);
  }
}
