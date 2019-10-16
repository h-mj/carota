import { deviate, Success } from "deviator";

// prettier-ignore
export const deleteDishDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

export type DeleteDishDto = Success<typeof deleteDishDtoValidator>;
