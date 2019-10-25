import { deviate, Success } from "deviator";

// prettier-ignore
export const createDishDtoValidator = deviate().object().shape({
  mealId: deviate().string().guid(),
  foodstuffId: deviate().string().guid(),
  quantity: deviate().number().positive()
});

export type CreateDishDto = Success<typeof createDishDtoValidator>;
