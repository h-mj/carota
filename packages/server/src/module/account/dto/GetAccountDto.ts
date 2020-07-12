import { deviate, Success } from "deviator";

export const getAccountDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
});

export type GetAccountDto = Success<typeof getAccountDtoValidator>;
