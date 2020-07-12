import { UnauthorizedError } from "./UnauthorizedError";

export class InvalidCredentialsError extends UnauthorizedError {
  public constructor(...paths: string[][]) {
    super(
      `Invalid ${paths
        .map((path) => path[path.length - 1])
        .join(", ")
        .replace(/, ([^,]*)$/, " or $1")}.`,
      ...paths.map((path) => ({
        location: { part: "body" as const, path },
        reason: "invalid",
      }))
    );
  }
}
