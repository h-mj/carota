import { auth, AuthStore } from "./AuthStore";
import { views, ViewsStore } from "./ViewsStore";

/**
 * Mapping between store names and their class types.
 */
export interface Stores {
  auth: AuthStore;
  views: ViewsStore;
}

/**
 * Object that contains all stores which are provided to other components by
 * `Provider` component in `index.tsx`.
 */
export const STORES: Readonly<Stores> = {
  auth,
  views
};

/**
 * Type that is used to add all injectable store types to component properties.
 */
export type InjectedProps = Partial<Stores>;
