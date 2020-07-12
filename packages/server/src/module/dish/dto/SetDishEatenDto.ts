import { deviate, Success } from "deviator";

export const setDishEatenDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  eaten: deviate().boolean(),
});

export type SetDishEatenDto = Success<typeof setDishEatenDtoValidator>;
