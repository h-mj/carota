import { Deviation } from "deviator/lib/deviator/index";

import { Injectable, PipeTransform } from "@nestjs/common";

import { BadRequestError } from "../error/BadRequestError";

/**
 * Supported validation error reasons object shape.
 */
export type ValidationErrorReasons =
  | undefined
  | string
  | { [key: string]: ValidationErrorReasons };

/**
 * Validation deviation type that on success returns a value of type `T`.
 */
export type Validator<T> = Deviation<unknown, T, T, ValidationErrorReasons>;

@Injectable()
export class ValidationPipe<T> implements PipeTransform<unknown, T> {
  public constructor(private validator: Validator<T>) {}

  /**
   * Validates whether `unknown` typed value is `T` typed value using property
   * `validator`.
   *
   * @param value Value which is being validated.
   * @throws `BadRequestError` when validation failed.
   */
  public transform(value: unknown) {
    const result = this.validator(value);

    if (!result.ok) {
      throw BadRequestError.fromValidationErrors(result.value);
    }

    return result.value;
  }
}
