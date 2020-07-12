import { Condition, UnauthorizedHandler } from "canallo";

import { ForbiddenError } from "../base/error/ForbiddenError";

export const onUnauthorized: UnauthorizedHandler = (actor, action, target) => {
  throw new ForbiddenError(
    `This ${actor.constructor.name} is not allowed to ${action} this ${target.constructor.name}.`
  );
};

/**
 * Returns a condition that is true whether any of given conditions are true.
 */
export const or = <A extends object, T extends object>(
  ...conditions: Array<Condition<A, T>>
): Condition<A, T> => async (actor, target) => {
  for (const condition of conditions) {
    if (await condition(actor, target)) {
      return true;
    }
  }

  return false;
};
