import { deviate, Success } from "deviator";

// prettier-ignore
export const getAccountDtoValidator = deviate().object().shape({
  id: deviate().optional().string().guid()
});

export type GetAccountDto = Success<typeof getAccountDtoValidator>;
