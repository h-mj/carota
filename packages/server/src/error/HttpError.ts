export interface ErrorDto {
  status: number;
  reason: string;
  message?: string;
  details?: ErrorDetail[];
}

export interface ErrorDetail {
  location: Location;
  reason: string;
  message?: string;
}

export interface Location {
  part: "request-line" | "headers" | "body";
  path?: string[];
}

export abstract class HttpError {
  public status: number;
  public reason: string;
  public message?: string;
  public details?: ErrorDetail[];

  public constructor(
    status: number,
    reason: string,
    message?: string,
    ...details: ErrorDetail[]
  ) {
    this.status = status;
    this.reason = reason;
    this.message = message;
    this.details = details.length === 0 ? undefined : details;
  }

  public toDto(): ErrorDto {
    return {
      status: this.status,
      reason: this.reason,
      message: this.message,
      details: this.details
    };
  }
}
