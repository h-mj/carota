import { deviate, Success } from "deviator";

export const createDishDtoValidator = deviate().object().shape({
  mealId: deviate().string().guid(),
  foodstuffId: deviate().string().guid(),
  quantity: deviate().number().positive(),
  eaten: deviate().boolean(),
});

export type CreateDishDto = Success<typeof createDishDtoValidator>;
