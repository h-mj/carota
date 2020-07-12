import { deviate, Success } from "deviator";

export const deleteFoodstuffDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
});

export type DeleteFoodstuffDto = Success<typeof deleteFoodstuffDtoValidator>;
