import { ErrorDetail, HttpError } from "./HttpError";

export class ConflictError extends HttpError {
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(409, "Conflict", message, ...details);
  }
}
