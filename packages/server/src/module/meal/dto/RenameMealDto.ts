import { deviate, Success } from "deviator";

// prettier-ignore
export const renameMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  name: deviate().string().trim().nonempty()
});

export type RenameMealDto = Success<typeof renameMealDtoValidator>;
