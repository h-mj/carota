import { inject } from "mobx-react";
import * as React from "react";
import { getSceneUrl, SceneNames, SceneParameters } from "../scene";
import { InjectedProps } from "../store";

/**
 * Anchor component props.
 */
interface AnchorProps<TSceneName extends SceneNames> {
  /**
   * Name of the scene to which this anchor will redirect to.
   */
  sceneName: TSceneName;

  /**
   * Redirected scene parameters.
   */
  parameters: SceneParameters<TSceneName>;
}

/**
 * Component that on click redirects user to given scene with some parameters.
 */
@inject("scenes")
export class Anchor<TSceneName extends SceneNames> extends React.Component<
  AnchorProps<TSceneName> & InjectedProps
> {
  /**
   * Renders an anchor component.
   */
  public render() {
    return (
      <a href={getSceneUrl(this.props)} onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }

  /**
   * Prevents default anchor behavior and does custom redirection logic instead.
   */
  private handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();
    this.props.scenes!.redirect(this.props);
  };
}
