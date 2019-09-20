import { deviate, Success } from "deviator/lib/deviator";

import { ValidationPipe } from "../../../pipe/ValidationPipe";
import { LANGUAGES } from "../entity/Account";

// prettier-ignore
const createAccountDtoValidator = deviate().object().shape({
  name: deviate().string().trim().notEmpty(),
  language: deviate().string().options(LANGUAGES),
  email: deviate().string().trim().lowercase().email(),
  password: deviate().string().notEmpty(),
  invitationId: deviate().string().guid()
});

export type CreateAccountDto = Success<typeof createAccountDtoValidator>;

export const createAccountDtoValidationPipe = new ValidationPipe(
  createAccountDtoValidator
);
