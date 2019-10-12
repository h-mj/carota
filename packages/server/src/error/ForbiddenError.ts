import { ErrorDetail, HttpError } from "./HttpError";

export class ForbiddenError extends HttpError {
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(403, "Forbidden", message, ...details);
  }
}
