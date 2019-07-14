import * as React from "react";
import { Scene, SceneNames, SceneProps } from "./Scene";
import { Administration } from "./Administration";
import { Diet } from "./Diet";
import { FoodEdit } from "./FoodEdit";
import { FoodSearch } from "./FoodSearch";
import { History } from "./History";
import { Home } from "./Home";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Measurements } from "./Measurements";
import { Register } from "./Register";
import { Settings } from "./Settings";
import { Unknown } from "./Unknown";
import { withParameters } from "../utility/types";

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
  sceneName: TSceneName;
}

/**
 * Creates an object that defines some route's scene name and parameter names.
 */
const to = <TSceneName extends SceneNames, TParameterNames extends string>(
  sceneName: TSceneName,
  parameterNames?: TParameterNames[]
): To<TSceneName, TParameterNames> => ({
  sceneName,
  parameterNames
});

/**
 * Defines routes and corresponding scene and route parameter names.
 */
const ROUTES = {
  "/administration": to("Administration"),
  "/diet": to("Diet"),
  "/food/new": to("FoodEdit"),
  "/food/search": to("FoodSearch"),
  "/history": to("History"),
  "/": to("Home"),
  "/logout": to("Logout"),
  "/measurements": to("Measurements"),
  "/register/{invitationId}": to("Register", withParameters("invitationId")),
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
 * Object where scene names are mapped to its class. This object is used to
 * retrieve scene component by its name.
 */
export const SCENES = {
  Administration: Administration,
  Diet: Diet,
  FoodEdit: FoodEdit,
  FoodSearch: FoodSearch,
  History: History,
  Home: Home,
  Login: Login,
  Logout: Logout,
  Measurements: Measurements,
  Register: Register,
  Settings: Settings,
  Unknown: Unknown
} as const;

/**
 * Union of scene positions.
 */
export type ScenePosition = "main" | "side";

/**
 * Object that holds the information needed to render a scene.
 */
export class SceneContext<TSceneName extends SceneNames> {
  /**
   * Scene name.
   */
  public sceneName: TSceneName;

  /**
   * Scene route parameters.
   */
  public parameters: RouteParameters<TSceneName>;

  /**
   * Scene component props.
   */
  public props: SceneProps<TSceneName>;

  /**
   * Creates a new instance of `SceneContext`.
   *
   * @param sceneName Scene name.
   * @param parameters Scene route parameters.
   * @param props Scene component props.
   */
  public constructor(
    sceneName: TSceneName,
    parameters: RouteParameters<TSceneName>,
    props: SceneProps<TSceneName>
  ) {
    this.sceneName = sceneName;
    this.parameters = parameters;
    this.props = props;
  }

  /**
   * Renders the scene component.
   */
  public render(position: ScenePosition) {
    const SceneComponent: typeof Scene = SCENES[this.sceneName];

    return (
      <SceneComponent
        parameters={this.parameters}
        position={position}
        {...this.props}
      />
    );
  }

  /**
   * Returns an URL corresponding to this scene context, or `undefined`, if this
   * context doesn't have a matching route.
   */
  public getUrl(): string | undefined {
    forRoute: for (const route in ROUTES) {
      // If route's scene name is not context's scene name, skip.
      if (ROUTES[route as keyof typeof ROUTES].sceneName !== this.sceneName) {
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
            (this.parameters as any)[parameter]
          );
        }
      }

      // If there are still parameters present in url, it's also a wrong route.
      if (url.match(/{.*}/) !== null) {
        continue;
      }

      return url;
    }

    return;
  }

  /**
   * Context of scene on index path and to which is redirected to after
   * registration.
   */
  public static HOME: Readonly<SceneContexts> = new SceneContext(
    "Home",
    {},
    {}
  );

  /**
   * Context of a scene that is shown if user is not authenticated but tries to
   * access a scene that requires authentication.
   */
  public static GATEWAY: Readonly<SceneContexts> = new SceneContext(
    "Login",
    undefined,
    {}
  );

  /**
   * Context of a scene that is shown if no other scenes match current URL.
   */
  public static UNKNOWN: Readonly<SceneContexts> = new SceneContext(
    "Unknown",
    undefined,
    {}
  );

  /**
   * Scene which is used to exit the application.
   */
  public static EXIT: Readonly<SceneContexts> = new SceneContext(
    "Logout",
    {},
    {}
  );

  /**
   * Returns a scene context from given URL. `undefined` if no scenes match the
   * URL.
   *
   * @param url URL string.
   */
  public static from(url: string): SceneContexts | undefined {
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

      return new SceneContext(
        ROUTES[route as keyof typeof ROUTES].sceneName,
        parameters,
        {}
      ) as SceneContexts;
    }

    return undefined;
  }
}

/**
 * Union of all possible scene context types.
 */
export type SceneContexts = {
  [SceneName in SceneNames]: SceneContext<SceneName>
}[SceneNames];
