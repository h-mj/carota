import { SceneSceneComponentProps } from "./SceneComponent";

/**
 * Union of scene names.
 */
export type SceneNames =
  | "Advisees"
  | "Body"
  | "Confirmation"
  | "Diet"
  | "DishEdit"
  | "FoodstuffEdit"
  | "GroupEdit"
  | "Invite"
  | "Login"
  | "Logout"
  | "MealEdit"
  | "Measure"
  | "Register"
  | "Scanner"
  | "Search"
  | "Settings"
  | "Statistics"
  | "Unknown";

/**
 * Union of scene positions.
 */
export type ScenePositions = "center" | "main" | "side";

/**
 * Routing table route definition type.
 */
interface Route<TSceneName extends SceneNames, TParameterNames extends string> {
  /**
   * Name of the scene which will be shown.
   */
  sceneName: TSceneName;

  /**
   * Array of route parameter names.
   */
  parameterNames: TParameterNames[];
}

/**
 * Defines target scene name and route parameter names of routing table
 * endpoint.
 */
const routeTo = <
  TSceneName extends SceneNames,
  TParameterNames extends string = never
>(
  sceneName: TSceneName,
  ...parameterNames: TParameterNames[]
): Route<TSceneName, TParameterNames> => ({
  sceneName,
  parameterNames
});

/**
 * Application routing table.
 */
const ROUTES = {
  "/": routeTo("Diet"),
  "/advisees": routeTo("Advisees"),
  "/logout": routeTo("Logout"),
  "/measurements": routeTo("Body"),
  "/register/{invitationId}": routeTo("Register", "invitationId"),
  "/settings": routeTo("Settings"),
  "/statistics": routeTo("Statistics")
} as const;

/**
 * Route parameter object type of a scene with specified name.
 */
type SceneRouteParameters<TSceneName extends SceneNames> =
  | undefined
  | (typeof ROUTES[keyof typeof ROUTES] extends infer IRoute
      ? IRoute extends Route<infer ISceneName, infer IParameterNames>
        ? ISceneName extends TSceneName
          ? string extends IParameterNames
            ? {}
            : Record<IParameterNames, string>
          : never
        : never
      : never);

/**
 * Scene representation.
 */
export class Scene<TSceneName extends SceneNames> {
  /**
   * Name of this scene.
   */
  public readonly name: TSceneName;

  /**
   * Scene route parameters.
   */
  public readonly parameters: SceneRouteParameters<TSceneName>;

  /**
   * Scene scene component props.
   */
  public readonly props: SceneSceneComponentProps<TSceneName>;

  /**
   * Position of this scene.
   */
  public readonly position: ScenePositions;

  /**
   * Creates a new instance of `Scene` with specified `name` and `position`.
   */
  public constructor(
    name: TSceneName,
    parameters: SceneRouteParameters<TSceneName>,
    props: SceneSceneComponentProps<TSceneName>,
    position: ScenePositions = "main"
  ) {
    this.name = name;
    this.parameters = parameters;
    this.props = props;
    this.position = position;
  }

  /**
   * Returns the URL of this scene. If this scene does not have a matching
   * route, `window.location.pathname` is returned.
   */
  public get url(): string {
    forRoute: for (const route in ROUTES) {
      // If route's scene name is not this scene's name, skip.
      if (ROUTES[route as keyof typeof ROUTES].sceneName !== this.name) {
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

        // Replace all parameter placeholders with actual values.
        if (routePart.startsWith("{") && routePart.endsWith("}")) {
          parameters[routePart.substring(1, routePart.length - 1)] = urlPart;
        } else if (urlPart !== routePart) {
          continue forRoute;
        }
      }

      return new Scene(
        ROUTES[route as keyof typeof ROUTES].sceneName as SceneNames,
        parameters,
        {} as SceneSceneComponentProps<SceneNames>
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
 * Union of scenes.
 */
export type Scenes = { [Name in SceneNames]: Scene<Name> }[SceneNames];
