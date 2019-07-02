import { inject } from "mobx-react";
import * as React from "react";
import { Stages } from "../scene/Stage";
import { InjectedProps } from "../store/Store";

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
  stage: Stages;
}

/**
 * Component that on click redirects user to given scene with some parameters.
 */
@inject("views")
export class Anchor extends React.Component<AnchorProps & InjectedProps> {
  /**
   * Renders an anchor component.
   */
  public render() {
    return (
      <a
        className={this.props.className}
        href={this.props.stage.getUrl() || window.location.pathname}
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
    this.props.views!.redirect(this.props.stage);
  };
}
