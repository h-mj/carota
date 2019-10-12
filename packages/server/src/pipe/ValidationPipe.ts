import { Deviation } from "deviator";

import { BadRequestException, PipeTransform } from "@nestjs/common";

type Validator<T> = Deviation<unknown, T, T, unknown>;

export class ValidationPipe<T> implements PipeTransform<unknown, T> {
  public constructor(private readonly validator: Validator<T>) {}

  public transform(value: unknown): T {
    const result = this.validator(value);

    if (!result.ok) {
      throw new BadRequestException();
    }

    return result.value;
  }
}
