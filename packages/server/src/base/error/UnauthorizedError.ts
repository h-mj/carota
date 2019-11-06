import { ErrorDetail, HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(401, "Unauthorized", message, ...details);
  }
}
