import { SignIn } from "./SignIn";

/**
 * Interface that maps scene name to its class type.
 */
interface Scenes {
  signIn: typeof SignIn;
}

/**
 * Scene name type.
 */
export type Scene = keyof Scenes;

/**
 * Object where scene names are mapped to its class. This object is used to
 * render a scene using only its name and change drawn scene by only changing
 * the name of the current scene.
 */
export const SCENES: Scenes = {
  signIn: SignIn
};
