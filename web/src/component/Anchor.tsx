import { inject } from "mobx-react";
import * as React from "react";
import { SceneContexts } from "../scene/SceneContext";
import { Component } from "./Component";

/**
 * Anchor component props.
 */
interface AnchorProps {
  /**
   * Used by styled-components to restyle this component.
   */
  className?: string;

  /**
   * Context of a scene to which this anchor will redirect to.
   */
  context: SceneContexts;
}

/**
 * Component that on click redirects user to given scene with some parameters.
 */
@inject("views")
export class Anchor extends Component<AnchorProps> {
  /**
   * Renders an anchor component.
   */
  public render() {
    return (
      <a
        className={this.props.className}
        href={this.props.context.getUrl() || window.location.pathname}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    );
  }

  /**
   * Prevents default anchor behavior and executes custom redirection logic instead.
   */
  private handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();
    this.props.views!.redirect(this.props.context);
  };
}
