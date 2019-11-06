import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

import { HttpError } from "../error/HttpError";
import { ErrorResponder } from "./ErrorResponder";

@Catch(HttpError)
export class HttpErrorFilter extends ErrorResponder
  implements ExceptionFilter<HttpError> {
  public catch(error: HttpError, host: ArgumentsHost) {
    this.respond(error, host);
  }
}
