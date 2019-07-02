import * as React from "react";
import { Scene, SceneNames, SceneProps } from "./Scene";
import { Administration } from "./Administration";
import { Diet } from "./Diet";
import { FoodInformation } from "./FoodInformation";
import { FoodList } from "./FoodList";
import { History } from "./History";
import { Home } from "./Home";
import { Login } from "./Login";
import { Logout } from "./Logout";
import { Measurements } from "./Measurements";
import { Register } from "./Register";
import { Settings } from "./Settings";
import { Unknown } from "./Unknown";

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
  parameterNames: TParameterNames[];

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
  ...parameterNames: TParameterNames[]
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
  "/food/add": to("FoodInformation"),
  "/food/{id}/edit": to("FoodInformation", "id"),
  "/food/list": to("FoodList"),
  "/history": to("History"),
  "/": to("Home"),
  "/logout": to("Logout"),
  "/measurements": to("Measurements"),
  "/register/{invitationId}": to("Register", "invitationId"),
  "/settings": to("Settings")
};

/**
 * Type that is a union of all possible mappings from parameter names to `string` types of
 * all routes, which scene name is one of the `TSceneNames` names.
 */
export type Parameters<TSceneNames extends SceneNames> =
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
  FoodInformation: FoodInformation,
  FoodList: FoodList,
  History: History,
  Home: Home,
  Login: Login,
  Logout: Logout,
  Measurements: Measurements,
  Register: Register,
  Settings: Settings,
  Unknown: Unknown
};

/**
 * Object that holds the information needed to render a scene.
 */
export class Stage<TSceneName extends SceneNames> {
  /**
   * Scene name.
   */
  public sceneName: TSceneName;

  /**
   * Scene route parameters.
   */
  public parameters: Parameters<TSceneName>;

  /**
   * Scene component props.
   */
  public props: SceneProps<TSceneName>;

  /**
   * Creates a new instance of `Stage`.
   *
   * @param sceneName Scene name.
   * @param parameters Scene route parameters.
   * @param props Scene component props.
   */
  public constructor(
    sceneName: TSceneName,
    parameters: Parameters<TSceneName>,
    props: SceneProps<TSceneName>
  ) {
    this.sceneName = sceneName;
    this.parameters = parameters;
    this.props = props;
  }

  /**
   * Renders a scene component.
   */
  public render() {
    const SceneComponent: typeof Scene = SCENES[this.sceneName];

    return <SceneComponent parameters={this.parameters} {...this.props} />;
  }

  /**
   * Returns an URL of this stage, or `undefined`, if this stage doesn't have a matching route.
   */
  public getUrl(): string | undefined {
    forRoute: for (const route in ROUTES) {
      // If route's scene name is not stage's scene name, skip.
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
   * Stage that is shown on index path and to which is redirected to after
   * registration.
   */
  public static HOME: Readonly<Stages> = new Stage("Home", {}, {});

  /**
   * Stage that is shown if user is not authenticated but tries to access a stage
   * that requires authentication.
   */
  public static GATEWAY: Readonly<Stages> = new Stage("Login", undefined, {});

  /**
   * Stage that is shown if no other stages match current URL.
   */
  public static UNKNOWN: Readonly<Stages> = new Stage("Unknown", undefined, {});

  /**
   * Scene which is used to exit the application.
   */
  public static EXIT: Readonly<Stages> = new Stage("Logout", {}, {});

  /**
   * Returns a stage from given URL. `undefined` if no stages match the URL.
   *
   * @param url URL string.
   */
  public static from(url: string): Stages | undefined {
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

      return new Stage(
        ROUTES[route as keyof typeof ROUTES].sceneName,
        parameters,
        {}
      ) as Stages;
    }

    return undefined;
  }
}

/**
 * Union of all possible stage types.
 */
export type Stages = {
  [SceneName in SceneNames]: Stage<SceneName>
}[SceneNames];
