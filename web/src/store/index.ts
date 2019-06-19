import { TranslationsStore } from "./TranslationsStore";
import { ScenesStore } from "./ScenesStore";

/**
 * Mapping between store name and its class type.
 */
export interface Stores {
  scenes: ScenesStore;
  translations: TranslationsStore;
}

/**
 * Object contains all stores which are provided to other components by
 * `Provider` component in `index.tsx`.
 */
export const STORES: Stores = {
  scenes: new ScenesStore(),
  translations: new TranslationsStore()
};

/**
 * Type that is used to add all injectable store types to component properties.
 */
export type InjectedProps = Partial<Stores>;
