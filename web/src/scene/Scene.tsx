import * as React from "react";
import { SceneParameters } from ".";
import { InjectedProps } from "../store";

/**
 * Scene component properties.
 */
export interface SceneProps<TSceneName extends string> extends InjectedProps {
  /**
   * Parameters of this scene.
   */
  parameters: SceneParameters<TSceneName>;
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
