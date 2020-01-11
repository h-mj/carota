import { Success, deviate } from "deviator";

/**
 * Validates whether a value is a valid input for group rename endpoint.
 */
// prettier-ignore
export const renameGroupDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  name: deviate().string().trim().nonempty()
});

/**
 * Rename group endpoint data transfer object type.
 */
export type RenameGroupDto = Success<typeof renameGroupDtoValidator>;
