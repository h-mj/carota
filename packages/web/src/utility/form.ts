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

/**
 * Returns error reason of specified `error` for field at specified `path`.
 */
export const reasonAt = (error: ErrorDto, ...path: string[]) => {
  if (error.details === undefined) {
    return undefined;
  }

  for (const detail of error.details) {
    const { path: errorPath } = detail.location;

    if (errorPath === undefined) {
      continue;
    }

    if (errorPath.every((value, index) => value === path[index])) {
      return detail.reason;
    }
  }

  return undefined;
};

/**
 * Converts specified date to `YYYY-MM-DD` formatted string that ignores current
 * timezone.
 */
export const toIsoDateString = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/**
 * Converts specified date to `DD.MM.YYYY` formatted string that ignores current
 * timezone.
 */
export const toDateString = (date: Date) =>
  `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
