import { Enum, ErrorReasons } from "api";
import { any } from "./form";

/**
 * Successful translation result type which is immediately returned.
 */
interface Ok<O> {
  kind: "ok";
  value: O;
}

/**
 * Successful translation result type which is used as an input for next
 * middleware in the chain. If no middleware proceeds, it is equivalent to an
 * `Ok<N>` result.
 */
interface Next<N> {
  kind: "next";
  value: N;
}

/**
 * Unsuccessful translation result type which is immediately returned.
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
 * Translator function type that translates an object with type `I` into an
 * object typed `O` and returns either `Ok<O>` or `Err<E>` type object.
 */
interface Translator<I, O, E> {
  (input: I): Ok<O> | Err<E>;
}

/**
 * Function type that is the building block of translation chains.
 *
 * Middleware function takes two arguments of type `I` and `P` as parameters and
 * returns either `Ok<O>`, `Next<N>` or `Err<E>` typed object.
 */
interface Middleware<I, P, O, N, E> {
  (input: I, parameters: P): Ok<O> | Next<N> | Err<E>;
}

/**
 * Translations class base class.
 */
abstract class Translations<I, O, N, E> {
  /**
   * Composition of all middleware functions in the chain.
   */
  protected middleware: Middleware<I, undefined, O, N, E>;

  /**
   * Creates a new instance of `Translations` with given middleware function.
   */
  protected constructor(middleware: Middleware<I, undefined, O, N, E>) {
    this.middleware = middleware;
  }

  /**
   * Converts middleware function into `Translator` typed function. The
   * difference between a `Translator` and `Middleware` is that translator
   * converts `Next<N>` middleware result type into `Ok<N>`. Translator function
   * also has only one argument opposite to middleware function, which have two.
   */
  public build = (): Translator<I, O | N, E> => input => {
    const result = this.middleware(input, undefined);
    return result.kind === "next" ? ok(result.value) : result;
  };
}

/**
 * Unknown type translation builder class.
 */
// prettier-ignore
class UnknownTranslations<I, O, N, E> extends Translations<I, O, N, E> {
  /**
   * Starting translation builder object instance which is the head of all
   * translation chains.
   */
  public static readonly INSTANCE = new UnknownTranslations<unknown, never, unknown, never>(input => next(input));

  /**
   * Validates that an unknown type is a boolean.
   */
  public boolean = () =>
    new BooleanTranslations(compose(this.middleware, UnknownTranslations.boolean, undefined));

  /**
   * Validates that an unknown type is null.
   */
  public null = () =>
    new NullTranslations(compose(this.middleware, UnknownTranslations.null, undefined));

  /**
   * Validates that an unknown type is a number.
   */
  public number = () =>
    new NumberTranslations(compose(this.middleware, UnknownTranslations.number, undefined));

  /**
   * Validates that an unknown type if an object excluding null.
   */
  public object = () =>
    new ObjectTranslations(compose(this.middleware, UnknownTranslations.object, undefined));

  /**
   * Allows value to be `undefined` and returns immediately if it is, otherwise
   * value is carried through the middleware chain.
   */
  public optional = () =>
    new UnknownTranslations(compose(this.middleware, UnknownTranslations.optional, undefined));

  /**
   * Validates that an unknown type is a string.
   */
  public string = () =>
    new StringTranslations(compose(this.middleware, UnknownTranslations.string, undefined));

  /**
   * Validates that an unknown type is undefined.
   */
  public undefined = () =>
    new UndefinedTranslations(compose(this.middleware, UnknownTranslations.undefined, undefined));

  /**
   * Boolean translation middleware.
   */
  private static boolean: Middleware<unknown, undefined, never, boolean, "invalid"> = input =>
    (typeof input === "boolean" ? next(input) : err("invalid"));

  /**
   * Null value translation middleware.
   */
  private static null: Middleware<unknown, undefined, never, null, "invalid"> = input =>
    (input === null ? next(input) : err("invalid"));

  /**
   * Number translation middleware.
   */
  private static number: Middleware<unknown, undefined, never, number, "invalid"> = input =>
    (typeof input === "number" ? next(input) : err("invalid"));

  /**
   * Object translation middleware.
   */
  private static object: Middleware<unknown, undefined, never, object, "invalid"> = input =>
    typeof input === "object" && input !== null ? next(input) : err("invalid");

  /**
   * Optional type translation middleware.
   */
  private static optional: Middleware<unknown, undefined, undefined, unknown, never> = input =>
    (input === undefined ? ok(input) : next(input));

  /**
   * String translation middleware.
   */
  private static string: Middleware<unknown, undefined, never, string, "invalid"> = input =>
    (typeof input === "string" ? next(input) : err("invalid"));

  /**
   * Undefined value translation middleware.
   */
  private static undefined: Middleware<unknown, undefined, never, undefined, "invalid"> = input =>
    (input === undefined ? next(input) : err("invalid"));
}

/**
 * Boolean type validator builder class.
 */
// prettier-ignore
class BooleanTranslations<I, O, N extends boolean, E> extends UnknownTranslations<I, O, N, E> {}

/**
 * Null value translation builder class.
 */
// prettier-ignore
class NullTranslations<I, O, E> extends UnknownTranslations<I, O, null, E> {}

/**
 * Number type translation builder class.
 */
// prettier-ignore
class NumberTranslations<I, O, N extends number, E> extends UnknownTranslations<I, O, N, E> {}

/**
 * Object type translation builder class.
 */
// prettier-ignore
class ObjectTranslations<I, O, N extends object, E> extends UnknownTranslations<I, O, N, E> {}

/**
 * String type translation builder class.
 */
// prettier-ignore
class StringTranslations<I, O, N extends string, E> extends UnknownTranslations<I, O, N, E> {
  /**
   * Validates that string is not empty.
   */
  public notEmpty = () =>
    new StringTranslations(compose(this.middleware, StringTranslations.notEmpty, undefined));

  /**
   * Validates whether string is one of the given options.
   */
  public options = <T extends string>(options: Enum<T>) =>
    new StringTranslations(compose(this.middleware, StringTranslations.options(), options));

  /**
   * Converts string type value into a float.
   */
  public parseFloat = () =>
    new NumberTranslations(compose(this.middleware, StringTranslations.parseFloat, undefined));

  /**
   * Trims string type value.
   */
  public trim = () =>
    new StringTranslations(compose(this.middleware, StringTranslations.trim, undefined));

  /**
   * Middleware that validates whether given string is not empty.
   */
  private static notEmpty: Middleware<string, undefined, never, string, "empty"> = input =>
    input === "" ? err("empty") : next(input);

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
 * Undefined value translation builder class.
 */
// prettier-ignore
class UndefinedTranslations<I, O, E> extends UnknownTranslations<I, O, undefined, E> {}

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
 * Instance of translation builder class.
 */
export const to = UnknownTranslations.INSTANCE;

/**
 * Translation of object `F` properties to same named properties of object `T`.
 */
export type Translation<F, T> = {
  [P in keyof F & keyof T]: Translator<F[P], T[P], ErrorReasons>
};

type Valid<F, T> = { [P in keyof Translation<F, T>]: T[P] };

type Invalid<F, T> = Partial<Record<keyof Translation<F, T>, ErrorReasons>>;

export const translate = <F, T = never>(
  from: F,
  translation: Translation<F, T>
): Ok<Valid<F, T>> | Err<Invalid<F, T>> => {
  const oks: Partial<Valid<F, T>> = {};
  const errs: Invalid<F, T> = {};

  for (const property of Object.keys(translation) as (keyof F & keyof T)[]) {
    const result = translation[property](from[property]);

    if (result.kind === "ok") {
      oks[property] = result.value;
    } else {
      errs[property] = result.value;
    }
  }

  return any(errs) ? err(errs) : ok(oks as Valid<F, T>);
};
