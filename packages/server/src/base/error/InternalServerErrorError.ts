import { ErrorDetail, HttpError } from "./HttpError";

export class InternalServerErrorError extends HttpError {
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(500, "Internal Server Error", message, ...details);
  }
}
