import * as React from "react";

import { Administration } from "../scene/Administration";
import { Diet } from "../scene/Diet";
import { Edit } from "../scene/Edit";
import { History } from "../scene/History";
import { Home } from "../scene/Home";
import { Login } from "../scene/Login";
import { Logout } from "../scene/Logout";
import { Measurements } from "../scene/Measurements";
import { Register } from "../scene/Register";
import { Search } from "../scene/Search";
import { Settings } from "../scene/Settings";
import { Unknown } from "../scene/Unknown";
import { SceneComponentProps, SceneNames } from "./SceneComponent";

/**
 * Type that defines some route's scene name and parameter names.
 */
interface To<
  TSceneName extends SceneNames,
  TParameterNames extends string = never
> {
  /**
   * Route parameter names type.
   */
  parameterNames?: TParameterNames[];

  /**
   * Route scene name.
   */
  name: TSceneName;
}

/**
 * Creates an object that defines some route's scene name and parameter names.
 */
const to = <TSceneName extends SceneNames, TParameterNames extends string>(
  sceneName: TSceneName,
  ...parameterNames: TParameterNames[]
): To<TSceneName, TParameterNames> => ({
  name: sceneName,
  parameterNames
});

/**
 * Defines routes and corresponding scene and route parameter names.
 */
const ROUTES = {
  "/administration": to("Administration"),
  "/diet": to("Diet"),
  "/history": to("History"),
  "/": to("Home"),
  "/logout": to("Logout"),
  "/measurements": to("Measurements"),
  "/register/{invitationId}": to("Register", "invitationId"),
  "/search": to("Search"),
  "/settings": to("Settings")
} as const;

/**
 * Type that is a union of all possible mappings from parameter names to `string` types of
 * all routes, which scene name is one of the `TSceneNames` names.
 */
export type RouteParameters<TSceneNames extends SceneNames> =
  | undefined
  | (typeof ROUTES[keyof typeof ROUTES] extends infer ITypes
      ? ITypes extends To<infer ISceneName, infer IParameterNames>
        ? ISceneName extends TSceneNames
          ? string extends IParameterNames
            ? {}
            : Record<IParameterNames, string>
          : never
        : never
      : never);

/**
 * Object where scene names are mapped to its component. This object is used to
 * retrieve scene's component by its name.
 */
export const SCENE_COMPONENTS = {
  Administration: Administration,
  Diet: Diet,
  Edit: Edit,
  History: History,
  Home: Home,
  Login: Login,
  Logout: Logout,
  Measurements: Measurements,
  Register: Register,
  Search: Search,
  Settings: Settings,
  Unknown: Unknown
} as const;

/**
 * Union of scene positions.
 */
export type RenderPosition = "center" | "left";

/**
 * Object that holds the information needed to render a scene.
 */
export class Scene<TSceneName extends SceneNames> {
  /**
   * Scene name.
   */
  public readonly name: TSceneName;

  /**
   * Scene route parameters.
   */
  public readonly parameters: RouteParameters<TSceneName>;

  /**
   * Scene component props.
   */
  public readonly props: SceneComponentProps<TSceneName>;

  /**
   * Scene rendering position.
   */
  public readonly position: RenderPosition;

  /**
   * Creates a new instance of `Scene`.
   *
   * @param name Scene name.
   * @param parameters Scene route parameters.
   * @param props Scene component props.
   * @param position Scene rendering position.
   */
  public constructor(
    name: TSceneName,
    parameters: RouteParameters<TSceneName>,
    props: SceneComponentProps<TSceneName>,
    position: RenderPosition = "center"
  ) {
    this.name = name;
    this.parameters = parameters;
    this.props = props;
    this.position = position;
  }

  /**
   * Renders the scene component.
   */
  public render() {
    const SceneComponent: typeof React.Component = SCENE_COMPONENTS[this.name];

    return <SceneComponent scene={this} {...this.props} />;
  }

  /**
   * Returns this scene's corresponding URL or `window.location.pathname`, if
   * this scene doesn't have a matching route.
   */
  public getUrl(): string {
    forRoute: for (const route in ROUTES) {
      // If route's scene name is not this scene's name, skip.
      if (ROUTES[route as keyof typeof ROUTES].name !== this.name) {
        continue;
      }

      let url = route;

      if (this.parameters !== undefined) {
        // Replace all parameters with their values in parameters.
        for (const parameter in this.parameters) {
          // If there's no such parameter, it's a wrong route.
          if (!url.includes(`{${parameter}}`)) {
            continue forRoute;
          }

          url = url.replace(
            `{${parameter}}`,
            (this.parameters as Record<string, string>)[parameter]
          );
        }
      }

      // If there are still parameters present in url, it's also a wrong route.
      if (url.match(/{.*}/) !== null) {
        continue;
      }

      return url;
    }

    return window.location.pathname;
  }

  /**
   * Scene on index path and to which is redirected to after registration.
   */
  public static HOME: Readonly<Scenes> = new Scene("Home", {}, {});

  /**
   * Scene that is shown if user is not authenticated but tries to access a
   * scene that requires authentication.
   */
  public static GATEWAY: Readonly<Scenes> = new Scene("Login", undefined, {});

  /**
   * Scene that is shown if no other scenes match current URL.
   */
  public static UNKNOWN: Readonly<Scenes> = new Scene("Unknown", undefined, {});

  /**
   * Scene which is used to exit the application.
   */
  public static EXIT: Readonly<Scenes> = new Scene("Logout", {}, {});

  /**
   * Returns a scene from given URL. `undefined` if no scenes match the URL.
   *
   * @param url URL string.
   */
  public static from(url: string): Scenes | undefined {
    forRoute: for (const route in ROUTES) {
      const urlParts = url.split("/");
      const routeParts = route.split("/");

      if (urlParts.length !== routeParts.length) {
        continue;
      }

      const parameters: { [key: string]: string } = {};

      for (let i = 0; i < urlParts.length; ++i) {
        const urlPart = urlParts[i];
        const routePart = routeParts[i];

        if (routePart.startsWith("{") && routePart.endsWith("}")) {
          parameters[routePart.substring(1, routePart.length - 1)] = urlPart;
        } else if (urlPart !== routePart) {
          continue forRoute;
        }
      }

      return new Scene(
        ROUTES[route as keyof typeof ROUTES].name as SceneNames,
        parameters,
        {} as SceneComponentProps<SceneNames>
      ) as Scenes;
    }

    return undefined;
  }
}

/**
 * Union of all possible scene types.
 */
export type Scenes = {
  [SceneName in SceneNames]: Scene<SceneName>
}[SceneNames];
