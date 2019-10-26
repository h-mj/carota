import { deviate, Success } from "deviator";

import { validDate } from "../../../utility/validators";

// prettier-ignore
export const insertMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  date: deviate().string().then(validDate),
  index: deviate().number().integer().min(0)
});

export type InsertMealDto = Success<typeof insertMealDtoValidator>;
