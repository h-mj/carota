import { deviate, Success } from "deviator";

import { isValidDate } from "../../../utility/validators";

export const getAllMealsDtoValidator = deviate()
  .object()
  .shape({
    accountId: deviate().optional().string().guid(),
    date: deviate().string().then(isValidDate),
  });

export type GetAllMealsDto = Success<typeof getAllMealsDtoValidator>;
