import { deviate, err, ok, Success } from "deviator";
import { DateTime } from "luxon";

const validDate = (input: string) => {
  const date = DateTime.fromISO(input);

  return date.isValid ? ok(date.toISODate()) : err("invalidDate");
};

// prettier-ignore
export const getAllMealsDtoValidator = deviate().object().shape({
  accountId: deviate().string().guid(),
  date: deviate().string().append(validDate)
});

export type GetAllMealsDto = Success<typeof getAllMealsDtoValidator>;
