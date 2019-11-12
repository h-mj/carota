import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";

import { isValidDate } from "../../../utility/validators";

const withinMonth = (input: string) =>
  Math.abs(DateTime.fromISO(input).diffNow("months").months) > 1
    ? err("notWithinMonthDate")
    : ok(input);

// prettier-ignore
export const createMealDtoValidator = deviate().object().shape({
  name: deviate().string().trim().nonempty(),
  date: deviate().string().then(isValidDate).then(withinMonth)
});

export type CreateMealDto = Success<typeof createMealDtoValidator>;
