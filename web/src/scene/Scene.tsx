import * as React from "react";
import { Parameters } from "./Stage";
import { InjectedProps } from "../store";
import { Administration } from "./Administration";
import { Diet } from "./Diet";
import { FoodInformation } from "./FoodInformation";
import { History } from "./History";
import { Home } from "./Home";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Measurements } from "./Measurements";
import { Register } from "./Register";
import { Settings } from "./Settings";
import { Unknown } from "./Unknown";

/**
 * Type that maps scene names to their component classes.
 */
interface SceneMap {
  Administration: Administration;
  Diet: Diet;
  FoodInformation: FoodInformation;
  History: History;
  Home: Home;
  Login: Login;
  Logout: Logout;
  Measurements: Measurements;
  Register: Register;
  Settings: Settings;
  Unknown: Unknown;
}

/**
 * Union of scene names, used to reference a specific scene using its name.
 */
export type SceneNames = keyof SceneMap;

/**
 * Scene component props type.
 */
export type ScenePropsWith<
  TSceneName extends SceneNames,
  TProps = {}
> = TProps &
  InjectedProps & {
    /**
     * Parameters of this scene.
     */
    parameters: Parameters<TSceneName>;
  };

/**
 * Union of `TProps` types of scene components with name one of `TSceneNames`.
 */
export type SceneProps<
  TSceneNames extends SceneNames
> = SceneMap[TSceneNames] extends infer IClass
  ? IClass extends Scene<infer _, infer IProps>
    ? IProps
    : never
  : never;

/**
 * Scene component base class that is extended by all scene components.
 *
 * Generic parameter `TSceneName` is used to reference a scene by their name in
 * other parts of the application.
 */
export abstract class Scene<
  TSceneName extends SceneNames,
  TProps extends {} = {}
> extends React.Component<ScenePropsWith<TSceneName, TProps>> {}

/**
 * Scene names that do not require authentication.
 */
export const NO_AUTHENTICATION_SCENE_NAMES: Readonly<Array<SceneNames>> = [
  "Login",
  "Register"
];

/**
 * Scene names that do not require navigation bar.
 */
export const NO_NAVIGATION_SCENE_NAMES: Readonly<Array<SceneNames>> = [
  "Login",
  "Logout",
  "Register"
];
