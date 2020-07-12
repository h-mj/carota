import { deviate, Success } from "deviator";

/**
 * Validates whether some value is a valid `InsertAccountDto` typed object.
 */
export const insertAccountDtoValidator = deviate()
  .object()
  .shape({
    id: deviate().string().guid(),
    groupId: deviate().string().guid(),
    index: deviate().number().integer().min(0),
  });

/**
 * Insert account endpoint data transfer object type.
 */
export type InsertAccountDto = Success<typeof insertAccountDtoValidator>;
