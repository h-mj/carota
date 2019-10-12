import { Response } from "express";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";

import { ErrorDto, HttpError } from "../error/HttpError";
import { InternalServerErrorError } from "../error/InternalServerErrorError";

export interface ErrorResponse {
  error: ErrorDto;
}

@Injectable()
export class ErrorInterceptor<T> implements NestInterceptor<T, ErrorResponse> {
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ErrorResponse> {
    context
      .switchToHttp()
      .getResponse<Response>()
      .status(200);

    return next.handle().pipe(catchError(this.transform));
  }

  private transform = (error: unknown): Observable<ErrorResponse> => {
    let httpError: HttpError;

    if (error instanceof HttpError) {
      httpError = error;
    } else {
      httpError = new InternalServerErrorError();
    }

    return of({ error: httpError.toDto() });
  };
}
