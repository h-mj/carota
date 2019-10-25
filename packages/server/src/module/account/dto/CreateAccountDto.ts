import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";

import { LANGUAGES, SEXES } from "../Account";

const dateBeforeNow = (input: string) => {
  const date = DateTime.fromISO(input);

  if (!date.isValid) {
    return err("invalidDate");
  }

  return date.diffNow("milliseconds").milliseconds <= 0
    ? ok(date.toISODate())
    : err("futureDate");
};

// prettier-ignore
export const createAccountDtoValidator = deviate().object().shape({
  name: deviate().string().trim().nonempty(),
  sex: deviate().options(SEXES),
  birthDate: deviate().string().then(dateBeforeNow),
  language: deviate().options(LANGUAGES),
  email: deviate().string().trim().nonempty().lowercase().email(),
  password: deviate().string().nonempty().minLength(8),
  invitationId: deviate().string().guid()
});

export type CreateAccountDto = Success<typeof createAccountDtoValidator>;
