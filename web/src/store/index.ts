import { auth, AuthStore } from "./AuthStore";
import { scenes, ScenesStore } from "./ScenesStore";
import { translations, TranslationsStore } from "./TranslationsStore";

/**
 * Mapping between store name and its class type.
 */
export interface Stores {
  readonly auth: AuthStore;
  readonly scenes: ScenesStore;
  readonly translations: TranslationsStore;
}

/**
 * Object contains all stores which are provided to other components by
 * `Provider` component in `index.tsx`.
 */
export const STORES: Stores = {
  auth,
  scenes,
  translations
};

/**
 * Type that is used to add all injectable store types to component properties.
 */
export type InjectedProps = Partial<Stores>;
