import { deviate, Success } from "deviator";

export const deleteDishDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
});

export type DeleteDishDto = Success<typeof deleteDishDtoValidator>;
