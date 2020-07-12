import { deviate, Success } from "deviator";

/**
 * Validates whether given value is valid input data transfer object for group deletion endpoint.
 */
export const deleteGroupDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
});

/**
 * Delete group endpoint data transfer object.
 */
export type DeleteGroupDto = Success<typeof deleteGroupDtoValidator>;
