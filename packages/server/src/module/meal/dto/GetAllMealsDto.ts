import { deviate, Success } from "deviator";

import { validDate } from "../../../utility/validators";

// prettier-ignore
export const getAllMealsDtoValidator = deviate().object().shape({
  accountId: deviate().optional().string().guid(),
  date: deviate().string().then(validDate)
});

export type GetAllMealsDto = Success<typeof getAllMealsDtoValidator>;
