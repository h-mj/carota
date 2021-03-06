import { deviate, Success } from "deviator";

export const setDishQuantityValidator = deviate()
  .object()
  .shape({
    id: deviate().string().guid(),
    quantity: deviate().number().positive().round(2),
  });

export type SetDishQuantityDto = Success<typeof setDishQuantityValidator>;
