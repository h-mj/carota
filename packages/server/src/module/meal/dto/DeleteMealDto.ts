import { deviate, Success } from "deviator";

// prettier-ignore
export const deleteMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

export type DeleteMealDto = Success<typeof deleteMealDtoValidator>;
