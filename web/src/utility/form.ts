import { ErrorReasons, Error } from "api";

/**
 * Type of an object where `TValues` object properties are optional and their
 * value is either `ErrorReasons` or if previously value was an object, then
 * `ErrorReasonsFor` for that object instead.
 */
export type ErrorReasonsFor<TValues> = {
  [P in keyof TValues]?: TValues[P] extends object
    ? ErrorReasonsFor<TValues[P]>
    : ErrorReasons;
};

/**
 * Type of an object where `string` type property values are either
 * `ErrorReasons`, `undefined` or this type itself.
 */
interface ErrorReasonsTree {
  [P: string]: ErrorReasons | ErrorReasonsTree | undefined;
}

/**
 * Returns whether or not `tree` object or its sub-trees have any defined
 * `ErrorReasons` values.
 */
export const any = (tree: Readonly<ErrorReasonsTree>): boolean => {
  for (const property in tree) {
    const value = tree[property];

    if (typeof value === "string") {
      return true;
    } else if (typeof value === "object") {
      return any(value);
    }
  }

  return false;
};

/**
 * Navigates inside error reasons tree `tree` using `path` and assigns `reason`
 * to the destination field.
 *
 * @param reasons An reason object inside which we will navigate.
 * @param path Path to the erroneous field.
 * @param reason Field error reason.
 */
const put = (
  reasons: ErrorReasonsTree,
  path: string[],
  reason: ErrorReasons
) => {
  let node = reasons;

  const [field, ...steps] = path.slice().reverse();

  for (let step = steps.pop(); step !== undefined; step = steps.pop()) {
    if (!(step in node)) {
      node[step] = {};
    }

    const next = node[step];

    if (typeof next === "object") {
      node = next;
    }
  }

  node[field] = reason;
};

/**
 * For each error detail of given error assigns occurred error reason to its
 * path in the tree.
 *
 * @param tree Error reasons tree.
 * @param error Occurred API error.
 */
export const append = <T extends ErrorReasonsTree>(
  tree: T,
  error?: Error
): T => {
  if (error === undefined || error.details === undefined) {
    return tree;
  }

  for (const detail of error.details) {
    const { path } = detail.location;

    if (path === undefined) {
      continue;
    }

    put(tree, path, detail.reason);
  }

  return tree;
};
