import { Success, deviate } from "deviator";

// prettier-ignore
export const getAccountDtoValidator = deviate().object().shape({
  id: deviate().string().guid()
});

export type GetAccountDto = Success<typeof getAccountDtoValidator>;
