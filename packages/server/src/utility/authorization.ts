import { ForbiddenError } from "../error/ForbiddenError";

type Class<T> = new (...parameters: unknown[]) => T;

interface Right<
  TActor extends object,
  TAction extends string,
  TTarget extends object
> {
  actorClass: Class<TActor>;
  action: TAction;
  targetClass: Class<TTarget>;
  condition?: Partial<TTarget> | ((actor: TActor, target: TTarget) => boolean);
}

const templateToFunction = <TTarget>(template: Partial<TTarget>) => (
  _: unknown,
  target: TTarget
) =>
  (Object.keys(template) as Array<keyof TTarget>).every(
    key => template[key] === target[key]
  );

class Authorization {
  private rights: Right<object, string, object>[] = [];

  public allow = <
    TActor extends object,
    TAction extends string,
    TTarget extends object
  >(
    actorClass: Class<TActor>,
    action: TAction,
    targetClass: Class<TTarget>,
    condition?: Partial<TTarget> | ((actor: TActor, target: TTarget) => boolean)
  ) => {
    this.rights.push({ actorClass, action, targetClass, condition });
  };

  public can = <
    TActor extends object,
    TAction extends string,
    TTarget extends object
  >(
    actor: TActor,
    action: TAction,
    target: TTarget
  ) => {
    for (const right of this.rights) {
      if (
        !(actor instanceof right.actorClass) ||
        action !== right.action ||
        !(target instanceof right.targetClass)
      ) {
        continue;
      }

      let condition = right.condition;

      if (condition === undefined) {
        condition = {};
      }

      if (typeof condition === "object") {
        condition = templateToFunction(condition);
      }

      if (typeof condition === "function" && condition(actor, target)) {
        return true;
      }
    }

    return false;
  };

  public authorize = <
    TActor extends object,
    TAction extends string,
    TTarget extends object
  >(
    actor: TActor,
    action: TAction,
    target: TTarget
  ) => {
    if (!this.can(actor, action, target)) {
      throw new ForbiddenError(
        `This ${actor.constructor.name.toLowerCase()} can not ${action} this ${target.constructor.name.toLowerCase()}.`
      );
    }
  };
}

export const { allow, can, authorize } = new Authorization();
