import { deviate, Success } from "deviator";

export const searchFoodstuffDtoValidator = deviate()
  .object()
  .shape({
    query: deviate().string().trim().minLength(3),
  });

export type SearchFoodstuffDto = Success<typeof searchFoodstuffDtoValidator>;
