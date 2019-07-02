import { AuthStore } from "./AuthStore";
import { ViewsStore } from "./ViewsStore";

/**
 * Mapping between store names and their class types.
 */
interface StoreMap {
  auth: AuthStore;
  views: ViewsStore;
}

/**
 * Type that is used to add all injectable store types to component properties.
 */
export type InjectedProps = Partial<StoreMap>;

/**
 * Base class for store classes.
 */
export class Store {}
