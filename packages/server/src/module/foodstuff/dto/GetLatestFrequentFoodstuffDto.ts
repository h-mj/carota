import { deviate, Success } from "deviator";

export const getLatestFrequentFoodstuffDtoValidator = deviate().object().shape({
  name: deviate().string().trim().nonempty(),
});

export type GetLatestFrequentFoodstuffDto = Success<
  typeof getLatestFrequentFoodstuffDtoValidator
>;
