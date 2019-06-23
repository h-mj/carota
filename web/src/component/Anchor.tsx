import { inject } from "mobx-react";
import * as React from "react";
import { getSceneUrl, Stage } from "../scene";
import { InjectedProps } from "../store";

/**
 * Anchor component props.
 */
interface AnchorProps {
  /**
   * Used by styled-components to restyle this component.
   */
  className?: string;

  /**
   * Name of the scene to which this anchor will redirect to.
   */
  stage: Stage;
}

/**
 * Component that on click redirects user to given scene with some parameters.
 */
@inject("scenes")
export class Anchor extends React.Component<AnchorProps & InjectedProps> {
  /**
   * Renders an anchor component.
   */
  public render() {
    return (
      <a
        className={this.props.className}
        href={getSceneUrl(this.props.stage)}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    );
  }

  /**
   * Prevents default anchor behavior and does custom redirection logic instead.
   */
  private handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();
    this.props.scenes!.redirect(this.props.stage);
  };
}
