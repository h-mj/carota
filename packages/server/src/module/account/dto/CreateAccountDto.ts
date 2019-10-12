import { deviate, Success } from "deviator";

import { LANGUAGES, SEXES } from "../Account";

// prettier-ignore
export const createAccountDtoValidator = deviate().object().shape({
  name: deviate().string().trim().notEmpty(),
  sex: deviate().string().options(SEXES),
  birthDate: deviate().string(),
  language: deviate().string().options(LANGUAGES),
  email: deviate().string().trim().notEmpty().lowercase().email(),
  password: deviate().string().notEmpty().minLen(8),
  invitationId: deviate().string().guid()
});

export type CreateAccountDto = Success<typeof createAccountDtoValidator>;
