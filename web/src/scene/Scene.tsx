import * as React from "react";
import { Parameters } from ".";
import { InjectedProps } from "../store";

/**
 * Scene component properties.
 */
interface SceneProps<TSceneName extends string> extends InjectedProps {
  /**
   * Parameters of this scene.
   */
  parameters: Parameters<TSceneName>;
}

/**
 * Scene component base class that is extended by all scene components.
 *
 * Generic parameter `TSceneName` is used to reference a scene by their name in
 * other parts of the application. `TSceneName` must be unique.
 */
export abstract class Scene<TSceneName extends string> extends React.Component<
  SceneProps<TSceneName>
> {}
