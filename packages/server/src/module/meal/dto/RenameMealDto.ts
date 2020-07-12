import { deviate, Success } from "deviator";

export const renameMealDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  name: deviate().string().trim().nonempty(),
});

export type RenameMealDto = Success<typeof renameMealDtoValidator>;
