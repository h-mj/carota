import { deviate, Success } from "deviator";

// prettier-ignore
export const insertDishDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  mealId: deviate().string().guid(),
  index: deviate().number().integer()
});

export type InsertDishDto = Success<typeof insertDishDtoValidator>;
