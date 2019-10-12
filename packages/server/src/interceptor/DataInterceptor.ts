import { Response } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";

export interface DataResponse<T> {
  data: T;
}

@Injectable()
export class DataInterceptor<T> implements NestInterceptor<T, DataResponse<T>> {
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<DataResponse<T>> {
    context
      .switchToHttp()
      .getResponse<Response>()
      .status(200);

    return next.handle().pipe(map(data => ({ data })));
  }
}
