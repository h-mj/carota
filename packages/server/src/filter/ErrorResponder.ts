import { Response } from "express";

import { ArgumentsHost } from "@nestjs/common";

import { HttpError } from "../error/HttpError";

export abstract class ErrorResponder {
  protected respond(error: HttpError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(200).json({ error: error.toDto() });
  }
}
