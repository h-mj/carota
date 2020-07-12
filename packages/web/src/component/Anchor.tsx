import { inject } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { Scenes } from "../base/Scene";

/**
 * Anchor component props.
 */
interface AnchorProps {
  /**
   * Used by styled-components to restyle this component.
   */
  className?: string;

  /**
   * Callback function that is called before redirecting. If return value is
   * `false`, redirection is cancelled.
   */
  onClick?: () => void | false;

  /**
   * Scene to which this anchor will redirect to.
   */
  scene: Scenes;
}

/**
 * Component that changes main scene on click.
 */
@inject("viewStore")
export class Anchor extends Component<AnchorProps> {
  /**
   * Renders an anchor component.
   */
  public render() {
    return (
      <a
        className={this.props.className}
        href={this.props.scene.url}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    );
  }

  /**
   * Prevents default anchor behavior and sets main scene.
   */
  private handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();

    if (this.props.onClick !== undefined && this.props.onClick() === false) {
      return;
    }

    this.props.viewStore!.redirect(this.props.scene);
  };
}
