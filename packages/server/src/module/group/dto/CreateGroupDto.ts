import { deviate, Success } from "deviator";

/**
 * Validates whether a value is a valid input for group creation endpoint.
 */
export const createGroupDtoValidator = deviate().object().shape({
  name: deviate().string().trim().nonempty(),
});

/**
 * Create group endpoint data transfer object type.
 */
export type CreateGroupDto = Success<typeof createGroupDtoValidator>;
