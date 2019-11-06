import { ConflictError } from "./ConflictError";

export class UniqueConstraintError extends ConflictError {
  public constructor(...paths: string[][]) {
    super(
      `${paths.length > 1 ? "Fields" : "Field"} ${paths
        .map(path => path[path.length - 1])
        .join(", ")
        .replace(/, ([^,]*)$/, " and $1")} must be unique.`,
      ...paths.map(path => ({
        location: { part: "body" as const, path },
        reason: "conflict"
      }))
    );
  }
}
