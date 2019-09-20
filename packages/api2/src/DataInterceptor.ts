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
    _: ExecutionContext,
    next: CallHandler<T>
  ): Observable<DataResponse<T>> {
    return next.handle().pipe(map(this.transform));
  }

  private transform(data: T) {
    return { data };
  }
}
