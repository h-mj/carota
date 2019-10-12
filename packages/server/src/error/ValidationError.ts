import { BadRequestError } from "./BadRequestError";
import { ErrorDetail } from "./HttpError";

export type ValidationErrorTree =
  | { [P: string]: ValidationErrorTree }
  | string
  | undefined;

// prettier-ignore
export class ValidationError extends BadRequestError {
  public constructor(tree: ValidationErrorTree) {
    super("One or more fields failed validation", ...ValidationError.toDetailArray(tree));
  }

  private static toDetailArray(tree: ValidationErrorTree, path: string[] = []): ErrorDetail[] {
    if (tree === undefined) {
      return [];
    }

    if (typeof tree === "string") {
      return [{ location: { part: "body", path }, reason: tree }];
    }

    const details: ErrorDetail[] = [];

    for (const property in tree) {
      details.push(...ValidationError.toDetailArray(tree[property], path.concat([property])));
    }

    return details;
  }
}
