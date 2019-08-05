/**
 * Successful transform result that returns immediately.
 */
interface Ok<O> {
  kind: "Ok";
  value: O;
}

/**
 * Successful transform result type which is used as an input for next step in
 * the chain. If no step proceeds, it is equivalent to an `Ok<N>` result.
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
  boolean: <I>() => Step<I, never, I & boolean, "invalid">;
  construct: <I extends object, O extends object, B extends Blueprint<I, O>>(
    blueprint: B
  ) => Step<I, never, O, ConstructionErrors<I, O, B>>;
  notEmpty: <I extends string>() => Step<I, never, Exclude<I, "">, "empty">;
  null: <I>() => Step<I, never, I & null, "invalid">;
  number: <I>() => Step<I, never, I & number, "invalid">;
  object: <I>() => Step<I, never, I & object, "invalid">;
  optional: <I>() => Step<I, undefined, Exclude<I, undefined>, never>;
  options: <I, T>(...options: readonly T[]) => Step<I, never, T, "invalid">;
  parseFloat: <I extends string>() => Step<I, never, number, "invalid">;
  string: <I>() => Step<I, never, I & string, "invalid">;
  trim: <I extends string>() => Step<I, never, string, never>;
  undefined: <I>() => Step<I, never, I & undefined, "invalid">;
}

/**
 * Type that is used to transform type `I` into type `O`.
 */
type Transformation<I, O, E> = (input: I) => Ok<O> | Err<E>;

/**
 * Type of an object that defines for each property of object of type `I` and
 * `O` an `Transformation` type function that transforms property value of `I`
 * typed object to value of `O` typed object.
 */
export type Blueprint<I extends object, O extends object> = {
  [P in keyof I | keyof O]: Transformation<
    P extends keyof I ? I[P] : undefined,
    P extends keyof O ? O[P] : undefined,
    unknown
  >
};

/**
 * Construction errors that maps property names to occurred transformation error
 * values.
 */
type ConstructionErrors<
  I extends object,
  O extends object,
  B extends Blueprint<I, O>
> = {
  [P in keyof B]?: B[P] extends Transformation<
    P extends keyof I ? I[P] : undefined,
    P extends keyof O ? O[P] : undefined,
    infer E
  >
    ? E
    : never
};

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
  null: () => Shift<I, O, N & null, E | "invalid">;

  /**
   * If value is a number, transformation continues, otherwise error `"invalid"`
   * is returned.
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
   * If value is one of the options, transformation continues, otherwise error
   * result with value `"invalid"` is returned.
   */
  options: <T>(...options: readonly T[]) => Shift<I, O, T, E | "invalid">;

  /**
   * If value is a string, transformation continues, otherwise error `"invalid"`
   * is returned.
   */
  string: () => Shift<I, O, N & string, E | "invalid">;

  /**
   * If value is undefined, transformation continues, otherwise error
   * `"invalid"` is returned.
   */
  undefined: () => Shift<I, O, N & undefined, E | "invalid">;

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
 * Object transformation builder class instance type.
 */
interface ObjectShift<I, O, N extends object, E> {
  /**
   * Creates a new object with type `T` using current input value and blueprint
   * type object.
   *
   * On successful construction transformation continues using newly constructed
   * object, otherwise error result with value of object with errors will be
   * returned.
   */
  construct: <T extends object, B extends Blueprint<N, T>>(
    blueprint: B
  ) => Shift<I, O, T, E | ConstructionErrors<N, T, B>>;
}

/**
 * String transformation builder class instance type.
 */
interface StringShift<I, O, N extends string, E> {
  /**
   * If string is not empty, transformation continues, otherwise error result
   * with value `"empty"` is returned.
   */
  notEmpty: () => Shift<I, O, Exclude<N, "">, E | "empty">;

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
 * Intersection of all type specific transformation builder classes that can
 * continue the transformation chain.
 */
type Shift<I, O, N, E> = BaseShift<I, O, N, E> &
  (N extends object ? ObjectShift<I, O, N, E> : {}) &
  (N extends string ? StringShift<I, O, N, E> : {});

/**
 * Union of all transformation builder classes. Not type safe because different
 * transformation builder classes require that `N` type parameter must extend
 * some type.
 */
type ShiftUnion<I, O, N, E> = BaseShift<I, O, N, E> &
  // @ts-ignore
  ObjectShift<I, O, N, E> &
  // @ts-ignore
  StringShift<I, O, N, E>;

/**
 * Implementation of all built-in step type functions.
 */
const STEPS: Steps = {
  /**
   * If input is a `boolean`, transformation continues, otherwise error with
   * value `"invalid"` is returned.
   */
  boolean: () => input =>
    typeof input === "boolean" ? next(input) : err("invalid"),

  /**
   * Constructs an object with type `O` using given blueprint of type `B`.
   *
   * Blueprint object defines how properties of input object must be transformed
   * to construct object of type `B`.
   */
  construct: <I extends object, O extends object, B extends Blueprint<I, O>>(
    blueprint: B
  ) => input => {
    const structure: Partial<O> = {};
    const errors: ConstructionErrors<I, O, B> = {};

    for (const property in blueprint) {
      const result = blueprint[property](
        // @ts-ignore
        property in input ? input[property] : undefined
      );

      if (result.kind === "Err") {
        // @ts-ignore
        errors[property] = result.value;
      } else if (result.value !== undefined) {
        // @ts-ignore
        structure[property] = result.value;
      }
    }

    return Object.entries(errors).length === 0
      ? next(structure as O)
      : err(errors);
  },

  /**
   * Trims `string` type input and continues the transformation.
   */
  notEmpty: () => input =>
    input === "" ? err("empty") : next(input as Exclude<typeof input, "">),

  /**
   * If input is `null`, transformation continues, otherwise error with value
   * `"invalid"` is returned.
   */
  null: () => input =>
    input === null ? next(input as typeof input & null) : err("invalid"),

  /**
   * If input is a `number`, transformation continues, otherwise error with
   * value `"invalid"` is returned.
   */
  number: () => input =>
    typeof input === "number" ? next(input) : err("invalid"),

  /**
   * If input is an `object`, transformation continues, otherwise `Err` with
   * value `"invalid"` is returned.
   */
  object: () => input =>
    input !== null && typeof input === "object"
      ? next(input as typeof input & object)
      : err("invalid"),

  /**
   * If input is `undefined`, `Ok` with value `undefined` in returned, otherwise
   * transformation continues.
   */
  optional: () => input =>
    input === undefined
      ? ok(undefined)
      : next(input as Exclude<typeof input, undefined>),

  /**
   * If input value is one of the options, transformation continues, otherwise
   * error result with `"invalid"` value is returned.
   */
  options: (...options) => input =>
    options.includes((input as unknown) as (typeof options)[number])
      ? next((input as unknown) as (typeof options)[number])
      : err("invalid"),

  /**
   * Converts `string` type value into a float, if successful, transformation
   * continues with converted `number` type value, otherwise `Err` with value
   * `"invalid"` is returned.
   */
  parseFloat: () => input => {
    const value = Number.parseFloat(input);
    return Number.isNaN(value) ? err("invalid") : next(value);
  },

  /**
   * If input is a `string`, transformation continues, otherwise `Err` with
   * value `"invalid"` is returned.
   */
  string: () => input =>
    typeof input === "string" ? next(input) : err("invalid"),

  /**
   * Trims `string` value and continues the transformation.
   */
  trim: () => input => next(input.trim()),

  /**
   * If input is `undefined`, transformation continues, otherwise error with
   * value `"invalid"` is returned.
   */
  undefined: () => input =>
    typeof input === "undefined" ? next(input) : err("invalid")
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
    const previous = this.step;

    this.step = input => {
      const result = previous(input);

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

  public options<T>(...options: readonly T[]) {
    return this.append(STEPS.options<N, T>(...options));
  }

  public string() {
    return this.append(STEPS.string<N>());
  }

  public undefined() {
    return this.append(STEPS.undefined<N>());
  }

  // Implementation of `ObjectShift` methods.

  // @ts-ignore
  public construct<T extends object, B extends Blueprint<N, T>>(blueprint: B) {
    // @ts-ignore
    return this.append<N, never, T, ConstructionErrors<N, T, B>>(
      // @ts-ignore
      STEPS.construct<N, T, B>(blueprint)
    );
  }

  // Implementation of `StringShift` methods.

  public notEmpty() {
    // @ts-ignore
    return this.append<I, never, Exclude<N, "">, "empty">(STEPS.notEmpty<N>());
  }

  public parseFloat() {
    // @ts-ignore
    return this.append<N, never, number, "invalid">(STEPS.parseFloat<N>());
  }

  public trim() {
    // @ts-ignore
    return this.append<N, never, string, never>(STEPS.trim<N>());
  }
}

/**
 * Creates a new instance of transformation builder with input type `I`.
 */
export const from = <I>() => Builder.new<I>();
