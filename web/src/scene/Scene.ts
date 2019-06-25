import * as React from "react";
import { InjectedProps } from "../store";
import { Administration } from "./Administration";
import { Diet } from "./Diet";
import { History } from "./History";
import { Home } from "./Home";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Measurements } from "./Measurements";
import { Register } from "./Register";
import { Settings } from "./Settings";
import { Unknown } from "./Unknown";
import { Parameters } from "./Stage";

/**
 * Union of scene names, used to reference a specific scene using its name.
 */
export type SceneNames =
  | "administration"
  | "diet"
  | "history"
  | "home"
  | "login"
  | "logout"
  | "measurements"
  | "register"
  | "settings"
  | "unknown";

/**
 * Union of all scene classes.
 */
export type Scenes =
  | Administration
  | Diet
  | History
  | Home
  | Login
  | Logout
  | Measurements
  | Register
  | Settings
  | Unknown;

/**
 * Scene component props type.
 */
export type ScenePropsWith<TSceneName extends SceneNames, TProps> = TProps &
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
> = Scenes extends infer IClass
  ? IClass extends Scene<infer ISceneName, infer IProps>
    ? ISceneName extends TSceneNames
      ? IProps
      : never
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
export const NO_AUTHENTICATION_SCENE_NAMES: Readonly<SceneNames[]> = [
  "login",
  "register"
];
