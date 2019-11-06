import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException
} from "@nestjs/common";

import { NotFoundError } from "../error/NotFoundError";
import { ErrorResponder } from "./ErrorResponder";

@Catch(NotFoundException)
export class NotFoundExceptionFilter extends ErrorResponder
  implements ExceptionFilter<NotFoundException> {
  public catch(_: NotFoundException, host: ArgumentsHost) {
    this.respond(new NotFoundError(), host);
  }
}
