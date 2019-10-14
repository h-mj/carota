import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";

const validDateWithinMonth = (input: string) => {
  const date = DateTime.fromISO(input);

  if (!date.isValid) {
    return err("invalidDate");
  }

  return Math.abs(date.diffNow("months").months) > 1
    ? err("notWithinMonthDate")
    : ok(date.toISODate());
};

// prettier-ignore
export const createMealDtoValidator = deviate().object().shape({
  accountId: deviate().string().guid(),
  name: deviate().string().trim().notEmpty(),
  date: deviate().string().append(validDateWithinMonth)
});

export type CreateMealDto = Success<typeof createMealDtoValidator>;
