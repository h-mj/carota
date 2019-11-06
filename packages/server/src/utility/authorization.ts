import { UnauthorizedHandler } from "canallo";

import { ForbiddenError } from "../error/ForbiddenError";

// prettier-ignore
export const onUnauthorized: UnauthorizedHandler = (actor, action, target) => {
  throw new ForbiddenError(`This ${actor.constructor.name} is not allowed to ${action} this ${target.constructor.name}.`);
};
