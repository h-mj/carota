import { deviate, Success } from "deviator";

import { validDate } from "../../../utility/validators";

// prettier-ignore
export const insertMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  date: deviate().string().append(validDate),
  index: deviate().number()
});

export type InsertMealDto = Success<typeof insertMealDtoValidator>;
