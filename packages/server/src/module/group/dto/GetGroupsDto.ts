import { deviate, Success } from "deviator";

/**
 * Validates whether given value is `GetGroupsDto` typed object.
 */
export const getGroupsDtoValidator = deviate().object().shape({
  accountId: deviate().string(),
});

/**
 * Get groups endpoint data transfer object.
 */
export type GetGroupsDto = Success<typeof getGroupsDtoValidator>;
