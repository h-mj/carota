import { Deviation } from "deviator";

import { PipeTransform } from "@nestjs/common";

import { ValidationError, ValidationErrorTree } from "./error/ValidationError";

type Validator<T> = Deviation<unknown, T, T, ValidationErrorTree>;

export class ValidationPipe<T> implements PipeTransform<unknown, T> {
  public constructor(private readonly validator: Validator<T>) {}

  public transform(value: unknown): T {
    const result = this.validator(value);

    if (!result.ok) {
      throw new ValidationError(result.value);
    }

    return result.value;
  }
}
