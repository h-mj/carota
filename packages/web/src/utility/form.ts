import { ErrorDto } from "server";

/**
 * Type of an object where `TValues` object properties are optional and their
 * value is either `string` or if previously value was an object, then
 * `ErrorsFor` for that object instead.
 */
export type ErrorsFor<TValues> = {
  [P in keyof TValues]?: TValues[P] extends object
    ? ErrorsFor<TValues[P]>
    : string;
};

/**
 * Type of an object where `string` type property values are either
 * `string`, `undefined` or this type itself.
 */
interface ErrorTree {
  [P: string]: undefined | string | ErrorTree;
}

/**
 * Returns whether or not `tree` object or its sub-trees have any defined values.
 */
export const any = (tree: Readonly<ErrorTree>): boolean => {
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
const put = (reasons: ErrorTree, path: string[], reason: string) => {
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
export const append = <T extends ErrorTree>(tree: T, error?: ErrorDto): T => {
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
