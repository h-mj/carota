import { BadRequestError } from "./BadRequestError";

export class InvalidIdError extends BadRequestError {
  public constructor(entity: Function, path: string[]) {
    super(`Provided ${entity.name} ID is invalid.`, {
      location: { part: "body", path },
      reason: "invalid"
    });
  }
}
