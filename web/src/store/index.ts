import { auth, AuthStore } from "./AuthStore";
import { translations, TranslationsStore } from "./TranslationsStore";
import { view, ViewStore } from "./ViewStore";

/**
 * Mapping between store names and their class types.
 */
export interface Stores {
  auth: AuthStore;
  translations: TranslationsStore;
  view: ViewStore;
}

/**
 * Object that contains all stores which are provided to other components by
 * `Provider` component in `index.tsx`.
 */
export const STORES: Readonly<Stores> = {
  auth,
  translations,
  view
};

/**
 * Type that is used to add all injectable store types to component properties.
 */
export type InjectedProps = Partial<Stores>;
