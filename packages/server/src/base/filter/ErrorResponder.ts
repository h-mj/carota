import { Response } from "express";

import { ArgumentsHost } from "@nestjs/common";

import { ErrorDto, HttpError } from "../error/HttpError";

export interface ErrorResponse {
  error: ErrorDto;
}

export abstract class ErrorResponder {
  protected respond(error: HttpError, host: ArgumentsHost, status = 200) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const errorResponse: ErrorResponse = {
      error: error.toDto(),
    };

    response.status(status).json(errorResponse);
  }
}
