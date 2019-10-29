import { observable } from "mobx";

import { SceneComponentNames, SceneComponentProps } from "./SceneComponent";

/**
 * Union of scene names.
 */
export type SceneNames =
  | "Confirmation"
  | "Diet"
  | "Edit"
  | "Login"
  | "Logout"
  | "Name"
  | "Quantity"
  | "Register"
  | "Scanner"
  | "Search"
  | "Unknown";

/**
 * Object that maps scene name to its scene component name.
 */
const SCENE_TO_COMPONENT_NAME = {
  Confirmation: "Confirmation",
  Diet: "Diet",
  Edit: "Edit",
  Login: "Login",
  Logout: "Logout",
  Name: "Name",
  Quantity: "Quantity",
  Register: "Register",
  Scanner: "Scanner",
  Search: "Search",
  Unknown: "Unknown"
} as const;

/**
 * Scene component name of a scene named `TName`.
 */
export type SceneSceneComponentName<
  TName extends SceneNames
> = typeof SCENE_TO_COMPONENT_NAME[TName];

/**
 * Scene names of a scene component named `TName`. Opposite to `SceneSceneComponentName`.
 */
export type SceneComponentSceneNames<TName extends SceneComponentNames> = {
  [Name in SceneNames]: typeof SCENE_TO_COMPONENT_NAME[Name] extends TName
    ? Name
    : never;
}[SceneNames];

/**
 * Type that defines some route's scene name and parameter names.
 */
interface To<TName extends SceneNames, TParameterNames extends string = never> {
  /**
   * Route parameter names type.
   */
  parameterNames?: TParameterNames[];

  /**
   * Route scene name.
   */
  name: TName;
}

/**
 * Creates an object that defines some route's scene name and parameter names.
 */
const to = <TName extends SceneNames, TParameterNames extends string>(
  sceneName: TName,
  ...parameterNames: TParameterNames[]
): To<TName, TParameterNames> => ({
  name: sceneName,
  parameterNames
});

/**
 * Defines routes and corresponding scene and route parameter names.
 */
const ROUTES = {
  "/": to("Diet"),
  "/logout": to("Logout"),
  "/register/{invitationId}": to("Register", "invitationId"),
  "/scan": to("Scanner")
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
 * Scene named `TName` scene component props type.
 */
export type SceneSceneComponentProps<
  TName extends SceneNames
> = SceneComponentProps<SceneSceneComponentName<TName>>;

/**
 * Union of scene positions.
 */
export type RenderPosition = "center" | "left" | "main";

/**
 * Object that holds the information needed to render a scene.
 */
export class Scene<TName extends SceneNames> {
  /**
   * Scene name.
   */
  public readonly name: TName;

  /**
   * Scene route parameters.
   */
  public readonly parameters: RouteParameters<TName>;

  /**
   * Scene scene component name.
   */
  public readonly componentName: SceneSceneComponentName<TName>;

  /**
   * Scene scene component props.
   */
  public readonly props: SceneSceneComponentProps<TName>;

  /**
   * Scene rendering position.
   */
  public readonly position: RenderPosition;

  /**
   * Scene title which if set is used by `TitleBar` component to display
   * currently active scene title.
   */
  @observable public title?: string;

  /**
   * Creates a new instance of `Scene`.
   *
   * @param name Scene name.
   * @param parameters Scene route parameters.
   * @param props Scene component props.
   * @param position Scene rendering position.
   */
  public constructor(
    name: TName,
    parameters: RouteParameters<TName>,
    props: SceneSceneComponentProps<TName>,
    position: RenderPosition = "main"
  ) {
    this.name = name;
    this.parameters = parameters;
    this.componentName = SCENE_TO_COMPONENT_NAME[name];
    this.props = props;
    this.position = position;
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
 * Scene on index path and to which user is redirected after registration.
 */
export const INDEX_SCENE = new Scene("Diet", {}, {});

/**
 * Scene that is shown if user is not authenticated but tries to access a
 * scene that requires authentication.
 */
export const GATEWAY_SCENE = new Scene("Login", undefined, {});

/**
 * Scene that is shown if no other scenes match current URL.
 */
export const UNKNOWN_SCENE = new Scene("Unknown", undefined, {});

/**
 * Union of all possible scene types.
 */
export type Scenes = {
  [SceneName in SceneNames]: Scene<SceneName>;
}[SceneNames];
