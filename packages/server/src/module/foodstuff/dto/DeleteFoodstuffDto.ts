import { deviate, Success } from "deviator";

// prettier-ignore
export const deleteFoodstuffDtoValidator = deviate().object().shape({
  foodstuffId: deviate().string().guid()
});

export type DeleteFoodstuffDto = Success<typeof deleteFoodstuffDtoValidator>;
