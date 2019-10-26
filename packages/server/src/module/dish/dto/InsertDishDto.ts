import { deviate, Success } from "deviator";

// prettier-ignore
export const insertDishDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  mealId: deviate().string().guid(),
  index: deviate().number().integer().min(0)
});

export type InsertDishDto = Success<typeof insertDishDtoValidator>;
