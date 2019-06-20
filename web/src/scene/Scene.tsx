import * as React from "react";
import { Parameters } from ".";
import { InjectedProps } from "../store";

/**
 * Scene component properties.
 */
interface SceneProps<TSceneName extends string> extends InjectedProps {
  parameters: Parameters<TSceneName>;
}

/**
 * Scene component base class that must be extended by all scene components.
 * Generic parameter `TSceneName` will be used to reference created scene in
 * other parts of this application.
 */
export abstract class Scene<TSceneName extends string> extends React.Component<
  SceneProps<TSceneName>
> {}
