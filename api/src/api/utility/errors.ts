import { ValidationError } from "@hapi/joi";
import { BadRequestError } from "../../error/BadRequestError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const badRequestErrorFrom = (_: ValidationError) => {
  return new BadRequestError();
};
