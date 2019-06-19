import { observable } from "mobx";
import { Scene } from "../scene";

/**
 * Store that stores and updates all scenes.
 *
 * It is also responsible for selecting correct scene based on current URL and
 * updating current URL if scene is changed.
 */
export class ScenesStore {
  /**
   * Current main scene.
   */
  @observable public main: Scene = "signIn";
}

/**
 * The only `ScenesStore` class instance.
 */
export const scenes = new ScenesStore();
