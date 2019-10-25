import { deviate, Success } from "deviator";

// prettier-ignore
export const searchFoodstuffDtoValidator = deviate().object().shape({
  query: deviate().string().trim().minLength(3)
});

export type SearchFoodstuffDto = Success<typeof searchFoodstuffDtoValidator>;
