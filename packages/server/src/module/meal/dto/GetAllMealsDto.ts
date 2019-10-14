import { deviate, Success } from "deviator";

import { validDate } from "../../../utility/validators";

// prettier-ignore
export const getAllMealsDtoValidator = deviate().object().shape({
  accountId: deviate().string().guid(),
  date: deviate().string().append(validDate)
});

export type GetAllMealsDto = Success<typeof getAllMealsDtoValidator>;
