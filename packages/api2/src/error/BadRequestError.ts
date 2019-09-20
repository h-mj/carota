import { ValidationErrorReasons } from "../pipe/ValidationPipe";
import { ErrorDetail, HttpError } from "./HttpError";

/**
 * HTTP 400 (Bad Request) error.
 */
export class BadRequestError extends HttpError {
  /**
   * Creates a new instance of `BadRequestError`.
   */
  public constructor(message?: string, ...details: ErrorDetail[]) {
    super(400, "Bad Request", message, ...details);
  }

  /**
   * Recursively flattens specified `ValidationErrorReasons` type object into an
   * array of error details.
   *
   * @param reasons Recursive error reason object.
   * @param path Absolute path of this error reason object within the root
   * object.
   */
  // prettier-ignore
  private static createValidationErrorDetails(reasons: ValidationErrorReasons, path: string[] = []): ErrorDetail[] {
    if (typeof reasons === "string") {
      return [{ location: { part: "body", path }, reason: reasons }];
    }

    const details: ErrorDetail[] = [];

    for (const property in reasons) {
      details.push(...BadRequestError.createValidationErrorDetails(reasons[property], path.concat([property])));
    }

    return details;
  }

  /**
   * Creates a bad request error because validation failed.
   */
  public static fromValidationErrors = (errors: ValidationErrorReasons) =>
    new BadRequestError(
      "One or more fields failed the validation",
      ...BadRequestError.createValidationErrorDetails(errors)
    );

  /**
   * Creates a bad request error because an entity with specified ID was not
   * found.
   */
  public static fromNotFoundId = (path: string[]) =>
    new BadRequestError("Entity with specified ID does not exist,", {
      location: { part: "body", path },
      reason: "notFound"
    });
}
