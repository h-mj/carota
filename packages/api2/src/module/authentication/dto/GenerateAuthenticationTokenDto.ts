import { deviate, Success } from "deviator/lib/deviator";

import { ValidationPipe } from "../../../pipe/ValidationPipe";

// prettier-ignore
const generateAuthenticationTokenDtoValidator = deviate().object().shape({
  email: deviate().string().trim().lowercase().notEmpty(),
  password: deviate().string().notEmpty()
});

export type GenerateAuthenticationTokenDto = Success<
  typeof generateAuthenticationTokenDtoValidator
>;

export const generateAuthenticationTokenDtoValidationPipe = new ValidationPipe(
  generateAuthenticationTokenDtoValidator
);
