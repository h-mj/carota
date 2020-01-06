import { Success, deviate } from "deviator";

// prettier-ignore
export const getAccountAdviseesDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

export type GetAccountAdviseesDto = Success<
  typeof getAccountAdviseesDtoValidator
>;
