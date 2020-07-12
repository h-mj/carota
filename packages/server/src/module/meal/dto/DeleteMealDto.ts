import { deviate, Success } from "deviator";

export const deleteMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
});

export type DeleteMealDto = Success<typeof deleteMealDtoValidator>;
