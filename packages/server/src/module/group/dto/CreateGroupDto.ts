import { Success, deviate } from "deviator";

/**
 * Validation function that validates whether given value is a valid
 * `CreateGroupDto` typed object.
 */
export const createGroupDtoValidator = deviate()
  .object()
  .shape({
    name: deviate().string()
  });

/**
 * Create group endpoint data transfer object type.
 */
export type CreateGroupDto = Success<typeof createGroupDtoValidator>;
