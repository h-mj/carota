import { deviate, Success } from "deviator";

import { isValidDate } from "../../../utility/validators";

export const insertMealDtoValidator = deviate()
  .object()
  .shape({
    id: deviate().string().guid(),
    date: deviate().string().then(isValidDate),
    index: deviate().number().integer().min(0),
  });

export type InsertMealDto = Success<typeof insertMealDtoValidator>;
