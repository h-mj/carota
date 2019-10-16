import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";

import { validDate } from "../../../utility/validators";

const withinMonth = (input: string) =>
  Math.abs(DateTime.fromISO(input).diffNow("months").months) > 1
    ? err("notWithinMonthDate")
    : ok(input);

// prettier-ignore
export const createMealDtoValidator = deviate().object().shape({
  name: deviate().string().trim().notEmpty(),
  date: deviate().string().append(validDate).append(withinMonth)
});

export type CreateMealDto = Success<typeof createMealDtoValidator>;
