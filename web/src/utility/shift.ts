/**
 * Successful transform result that returns immediately.
 */
interface Ok<O> {
  kind: "Ok";
  value: O;
}

/**
 * Successful transform result type which is used as an input for next step in the
 * chain. If no step proceeds, it is equivalent to an `Ok<N>` result.
 */
interface Next<N> {
  kind: "Next";
  value: N;
}

/**
 * Unsuccessful transform result type which is immediately returned.
 */
interface Err<E> {
  kind: "Err";
  value: E;
}

/**
 * Creates `Ok<O>` type object with given value.
 */
export const ok = <O>(value: O): Ok<O> => ({ kind: "Ok", value });

/**
 * Creates `Next<N>` type object with given value.
 */
export const next = <N>(value: N): Next<N> => ({ kind: "Next", value });

/**
 * Creates `Err<E>` type object with given value.
 */
export const err = <E>(value: E): Err<E> => ({ kind: "Err", value });

/**
 * Function type that transforms an object with type `I` into an object typed
 * `O` and returns either `Ok<O>`, `Next<N>` or `Err<E>` type object.
 */
interface Step<I, O, N, E> {
  (input: I): Ok<O> | Next<N> | Err<E>;
}

/**
 * Collection of built-in step function types.
 */
interface Steps {
  boolean: <N>() => Step<N, never, N & boolean, "invalid">;
  null: <N>() => Step<N, never, null, "invalid">;
  number: <N>() => Step<N, never, N & number, "invalid">;
  object: <N>() => Step<N, never, N & object, "invalid">;
  optional: <N>() => Step<N, undefined, Exclude<N, undefined>, never>;
  string: <N>() => Step<N, never, N & string, "invalid">;
  undefined: <N>() => Step<N, never, undefined, "invalid">;
  parseFloat: <N extends string>() => Step<N, never, number, "invalid">;
  trim: <N extends string>() => Step<N, never, string, never>;
}

/**
 * Type that is used to transform type `I` into type `O`.
 */
type Transformation<I, O, E> = (input: I) => Ok<O> | Err<E>;

/**
 * Transformation builder class instance type.
 */
interface BaseShift<I, O, N, E> {
  /**
   * If value is a boolean, transformation continues, otherwise error
   * `"invalid"` is returned.
   */
  boolean: () => Shift<I, O, N & boolean, E | "invalid">;

  /**
   * If value is null, transformation continues, otherwise error `"invalid"` is
   * returned.
   */
  null: () => Shift<I, O, null, E | "invalid">;

  /**
   * If value is a number, transformation continues, otherwise error
   * `"invalid"` is returned.
   */
  number: () => Shift<I, O, N & number, E | "invalid">;

  /**
   * If value is an object, transformation continues, otherwise error
   * `"invalid"` is returned.
   */
  object: () => Shift<I, O, N & object, E | "invalid">;

  /**
   * If value is `undefined`, function returns `Ok<undefined>` result, otherwise
   * transformation is continued.
   */
  optional: () => Shift<I, O | undefined, Exclude<N, undefined>, E>;

  /**
   * If value is a string, transformation continues, otherwise error
   * `"invalid"` is returned.
   */
  string: () => Shift<I, O, N & string, E | "invalid">;

  /**
   * If value is undefined, transformation continues, otherwise error
   * `"invalid"` is returned.
   */
  undefined: () => Shift<I, O, undefined, E | "invalid">;

  /**
   * Returns the transformation function that transforms value of type `I` into
   * a value of type `O` or `N` or returns an error response with value `E`.
   */
  build: () => Transformation<I, O | N, E>;

  /**
   * Composes given function into current transformation.
   */
  append: <I2, O2, N2, E2>(
    step: Step<I2, O2, N2, E2>
  ) => Shift<I, O | O2, N2, E | E2>;
}

/**
 * String transformation builder class instance type.
 */
interface StringShift<I, O, N extends string, E> extends BaseShift<I, O, N, E> {
  /**
   * If value can be converted into float, transformation continues with
   * converted numeric value, otherwise error result with `"invalid"` value is
   * returned.
   */
  parseFloat: () => Shift<I, O, number, E | "invalid">;

  /**
   * Trims current string value and continues the transformation.
   */
  trim: () => Shift<I, O, string, E>;
}

/**
 * Type that is used to retrieve type specific transformation builder class
 * based on type of `N`.
 */
type TypeShifts<I, O, N, E> =
  // @ts-ignore
  | ((type: string) => StringShift<I, O, N, E>)
  | ((type: unknown) => BaseShift<I, O, N, E>);

/**
 * Intersection of all type specific transformation builder classes that can
 * continue the transformation chain.
 */
type Shift<I, O, N, E> = (TypeShifts<I, O, N, E> extends infer IFunction
  ? IFunction extends ((type: N) => infer IShift)
    ? (shift: IShift) => void
    : never
  : never) extends ((shift: infer IShift) => void)
  ? IShift
  : never;

/**
 * Union of all transformation builder classes. Not type safe because different
 * transformation builder classes require that `N` type parameter must extend
 * some type.
 */
type ShiftUnion<I, O, N, E> = BaseShift<I, O, N, E> &
  // @ts-ignore
  StringShift<I, O, N, E>;

/**
 * Implementation of all built-in step type functions.
 */
const STEPS: Steps = {
  boolean: () => input =>
    typeof input === "boolean" ? next(input) : err("invalid"),
  null: () => input => (input === null ? next(null) : err("invalid")),
  number: () => input =>
    typeof input === "number" ? next(input) : err("invalid"),
  object: () => input =>
    input !== null && typeof input === "object"
      ? next(input as typeof input & object)
      : err("invalid"),
  optional: () => input =>
    input === undefined
      ? ok(undefined)
      : next(input as Exclude<typeof input, undefined>),
  parseFloat: () => input => {
    const value = Number.parseFloat(input);
    return Number.isNaN(value) ? err("invalid") : next(value);
  },
  string: () => input =>
    typeof input === "string" ? next(input) : err("invalid"),
  trim: () => input => next(input.trim()),
  undefined: () => input =>
    typeof input === "undefined" ? next(undefined) : err("invalid")
};

/**
 * Class that implements all typed shift interfaces and which is a builder of
 * `Transformation` type function that transforms some object with type `I` to
 * object with type `O` or `N`.
 *
 * Most of the builder methods are not type safe since this class implements
 * methods of all types of shifts, most of which narrow the type of `N` by
 * requiring it to be assignable to some type, e.g. `StringShift`s `N` type
 * parameter must be assignable to `string`, so that it can be used as parameter
 * for `Number.parseFloat` or its instance would have `trim` method defined.
 */
class Builder<I, O, N, E> implements ShiftUnion<I, O, N, E> {
  /**
   * Composition of all step functions.
   */
  private step: Step<I, O, N, E>;

  /**
   * Creates a new instance of `Builder` with given step function.q
   */
  private constructor(step: Step<I, O, N, E>) {
    this.step = step;
  }

  /**
   * Creates and returns a new instance of `Builder` class with step function as
   * identity function.
   */
  public static new = <N>(): Shift<N, never, N, never> =>
    // @ts-ignore
    new Builder<N, never, N, never>(input => next(input));

  public build(): Transformation<I, O | N, E> {
    return input => {
      const result = this.step(input);
      return result.kind === "Next" ? ok(result.value) : result;
    };
  }

  public append<I2, O2, N2, E2>(
    step: Step<I2, O2, N2, E2>
  ): Shift<I, O | O2, N2, E | E2> {
    // @ts-ignore
    this.step = input => {
      const result = this.step(input);

      // @ts-ignore
      return result.kind === "Next" ? step(result.value) : result;
    };

    // @ts-ignore
    return this;
  }

  // Implementation of `BaseShift` methods.

  public boolean() {
    return this.append(STEPS.boolean<N>());
  }

  public null() {
    return this.append(STEPS.null<N>());
  }

  public number() {
    return this.append(STEPS.number<N>());
  }

  public object() {
    return this.append(STEPS.object<N>());
  }

  public optional() {
    return this.append(STEPS.optional<N>());
  }

  public string() {
    return this.append(STEPS.string<N>());
  }

  public undefined() {
    return this.append(STEPS.undefined<N>());
  }

  // Implementation of `StringShift` methods.

  public parseFloat() {
    // @ts-ignore
    return this.append<I, O, number, "invalid">(STEPS.parseFloat<N>());
  }

  public trim() {
    // @ts-ignore
    return this.append<I, O, string, E>(STEPS.trim<N>());
  }
}

/**
 * Creates a new instance of transformation builder with input type `I`.
 */
export const to = <I>() => Builder.new<I>();
