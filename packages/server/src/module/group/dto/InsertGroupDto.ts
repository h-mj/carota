import { Success, deviate } from "deviator";

/**
 * Validates whether given value is `InsertGroupDto` typed object.
 */
// prettier-ignore
export const insertGroupDtoValidator = deviate().object().shape({
  id: deviate().string().guid(),
  index: deviate().number().integer().min(0)
});

/**
 * Insert group endpoint data transfer object.
 */
export type InsertGroupDto = Success<typeof insertGroupDtoValidator>;
