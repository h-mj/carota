import { Enum } from "api";

/**
 * Successful validation result type which is immediately returned.
 */
interface Ok<O> {
  kind: "ok";
  value: O;
}

/**
 * Successful validation result type which is used as an input for next
 * middleware in the chain. If no middleware proceeds, it is equivalent to an
 * `Ok<N>` result.
 */
interface Next<N> {
  kind: "next";
  value: N;
}

/**
 * Unsuccessful validation result type which is immediately returned.
 */
interface Err<E> {
  kind: "err";
  value: E;
}

/**
 * Creates `Ok<O>` type object with given value.
 */
const ok = <O>(value: O): Ok<O> => ({ kind: "ok", value });

/**
 * Creates `Next<N>` type object with given value.
 */
const next = <N>(value: N): Next<N> => ({ kind: "next", value });

/**
 * Creates `Err<E>` type object with given value.
 */
const err = <E>(value: E): Err<E> => ({ kind: "err", value });

/**
 * Validation function type that returns either `Ok<O>` or `Err<E>` type object.
 */
interface Validator<I, O, E> {
  (input: I): Ok<O> | Err<E>;
}

/**
 * Function type that is the building block of validation chains.
 *
 * Middleware function takes two arguments of type `I` and `P` as parameters and
 * returns either `Ok<O>`, `Next<N>` or `Err<E>` typed object.
 */
interface Middleware<I, P, O, N, E> {
  (input: I, parameters: P): Ok<O> | Next<N> | Err<E>;
}

/**
 * Validation class base class.
 */
abstract class Validation<I, O, N, E> {
  /**
   * Composition of all middleware functions in the chain.
   */
  protected middleware: Middleware<I, undefined, O, N, E>;

  /**
   * Creates a new instance of `Validation` with given middleware function.
   */
  protected constructor(middleware: Middleware<I, undefined, O, N, E>) {
    this.middleware = middleware;
  }

  /**
   * Converts middleware function into `Validator` typed function, that converts
   * `Next<N>` middleware result type into `Ok<N>`. Validation function also has
   * only one argument opposite to middleware function, which have two.
   */
  public build = (): Validator<I, O | N, E> => input => {
    const result = this.middleware(input, undefined);
    return result.kind === "next" ? ok(result.value) : result;
  };
}

/**
 * Unknown type validator builder class.
 */
// prettier-ignore
class UnknownValidation<I, O, N, E> extends Validation<I, O, N, E> {
  /**
   * Starting validation object instance which all validation objects expand.
   */
  public static readonly INSTANCE = new UnknownValidation<unknown, never, unknown, never>(input => next(input));

  /**
   * Validates that an unknown type is a boolean.
   */
  public boolean = () =>
    new BooleanValidation(compose(this.middleware, UnknownValidation.boolean, undefined));

  /**
   * Validates that an unknown type is null.
   */
  public null = () =>
    new NullValidation(compose(this.middleware, UnknownValidation.null, undefined));

  /**
   * Validates that an unknown type is a number.
   */
  public number = () =>
    new NumberValidation(compose(this.middleware, UnknownValidation.number, undefined));

  /**
   * Validates that an unknown type if an object excluding null.
   */
  public object = () =>
    new ObjectValidation(compose(this.middleware, UnknownValidation.object, undefined));

  /**
   * Allows value to be `undefined` and returns immediately if it is, otherwise
   * value is carried through the middleware chain.
   */
  public optional = () =>
    new UnknownValidation(compose(this.middleware, UnknownValidation.optional, undefined));

  /**
   * Validates that an unknown type is a string.
   */
  public string =
    () => new StringValidation(compose(this.middleware, UnknownValidation.string, undefined));

  /**
   * Validates that an unknown type is undefined.
   */
  public undefined =
    () => new UndefinedValidation(compose(this.middleware, UnknownValidation.undefined, undefined));

  /**
   * Boolean validation middleware.
   */
  private static boolean: Middleware<unknown, undefined, never, boolean, "invalid"> = input =>
    (typeof input === "boolean" ? next(input) : err("invalid"));

  /**
   * Null value validation middleware.
   */
  private static null: Middleware<unknown, undefined, never, null, "invalid"> = input =>
    (input === null ? next(input) : err("invalid"));

  /**
   * Number validation middleware.
   */
  private static number: Middleware<unknown, undefined, never, number, "invalid"> = input =>
    (typeof input === "number" ? next(input) : err("invalid"));

  /**
   * Object validation middleware.
   */
  private static object: Middleware<unknown, undefined, never, object, "invalid"> = input =>
    typeof input === "object" && input !== null ? next(input) : err("invalid");

  /**
   * Optional type validation middleware.
   */
  private static optional: Middleware<unknown, undefined, undefined, unknown, never> = input =>
    (input === undefined ? ok(input) : next(input));

  /**
   * String validation middleware.
   */
  private static string: Middleware<unknown, undefined, never, string, "invalid"> = input =>
    (typeof input === "string" ? next(input) : err("invalid"));

  /**
   * Undefined value validation middleware.
   */
  private static undefined: Middleware<unknown, undefined, never, undefined, "invalid"> = input =>
    (input === undefined ? next(input) : err("invalid"));
}

/**
 * Boolean type validator builder class.
 */
// prettier-ignore
class BooleanValidation<I, O, N extends boolean, E> extends UnknownValidation<I, O, N, E> {}

/**
 * Null value validator builder class.
 */
// prettier-ignore
class NullValidation<I, O, E> extends UnknownValidation<I, O, null, E> {}

/**
 * Number type validator builder class.
 */
// prettier-ignore
class NumberValidation<I, O, N extends number, E> extends UnknownValidation<I, O, N, E> {}

/**
 * Object type validator builder class.
 */
// prettier-ignore
class ObjectValidation<I, O, N extends object, E> extends UnknownValidation<I, O, N, E> {}

/**
 * String type validator builder class.
 */
// prettier-ignore
class StringValidation<I, O, N extends string, E> extends UnknownValidation<I, O, N, E> {
  /**
   * Validates whether string is one of the given options.
   */
  public options = <T extends string>(options: Enum<T>) =>
    new StringValidation(compose(this.middleware, StringValidation.options(), options));

  /**
   * Converts string type value into a float.
   */
  public parseFloat = () =>
    new NumberValidation(compose(this.middleware, StringValidation.parseFloat, undefined));

  /**
   * Trims string type value.
   */
  public trim = () =>
    new StringValidation(compose(this.middleware, StringValidation.trim, undefined));

  /**
   * Middleware that checks whether given input is one of the options.
   */
  private static options = <T extends string>(): Middleware<string, Enum<T>, never, T, "invalid"> =>
    (input, options) => {
      return input in options ? next(input as T) : err("invalid");
    }

  /**
   * Middleware that parses string value into a float.
   */
  private static parseFloat: Middleware<string, undefined, never, number, "invalid"> = input => {
    const value = Number.parseFloat(input);
    return Number.isNaN(value) ? err("invalid") : next(value);
  };

  /**
   * Middleware that trims string input.
   */
  private static trim: Middleware<string, undefined, never, string, never> = input =>
    next(input.trim());
}

/**
 * Undefined value validator builder class.
 */
// prettier-ignore
class UndefinedValidation<I, O, E> extends UnknownValidation<I, O, undefined, E> {}

/**
 * Returns the composition of two middleware functions.
 *
 * @param to Base middleware function.
 * @param middleware Middleware function.
 * @param parameters Middleware function parameters.
 */
const compose = <I1, O1, N1 extends I2, E1, I2, P, O2, N2, E2>(
  to: Middleware<I1, undefined, O1, N1, E1>,
  middleware: Middleware<I2, P, O2, N2, E2>,
  parameters: P
): Middleware<I1, undefined, O1 | O2, N2, E1 | E2> => input => {
  const result = to(input, undefined);
  return result.kind === "next" ? middleware(result.value, parameters) : result;
};

/**
 * Instance of validator builder class.
 */
export const is = UnknownValidation.INSTANCE;
