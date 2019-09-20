import { Response } from "express";

import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

import { ErrorDto, HttpError } from "./error/HttpError";
import { InternalServerErrorError } from "./error/InternalServerError";

export interface ErrorResponse {
  error: ErrorDto;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  public catch(error: unknown, host: ArgumentsHost) {
    let httpError: HttpError;

    if (error instanceof HttpError) {
      httpError = error;
    } else {
      httpError = new InternalServerErrorError();
    }

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const errorResponse: ErrorResponse = {
      error: httpError.toDto()
    };

    response.status(httpError.code).json(errorResponse);
  }
}
