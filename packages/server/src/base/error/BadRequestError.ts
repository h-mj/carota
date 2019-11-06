import { ErrorDetail, HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(400, "Bad Request", message, ...details);
  }
}
