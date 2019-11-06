import { ErrorDetail, HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(404, "Not Found", message, ...details);
  }
}
