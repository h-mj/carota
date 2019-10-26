import { deviate, Success } from "deviator";

// prettier-ignore
export const eatDishDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  eaten: deviate().boolean()
});

export type EatDishDto = Success<typeof eatDishDtoValidator>;
