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
 * Component that changes main scene on click.
 */
@inject("views")
export class Anchor extends Component<"Anchor", AnchorProps> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: AnchorProps) {
    super("Anchor", props);
  }

  /**
   * Renders an anchor component.
   */
  public render() {
    return (
      <a
        className={this.props.className}
        href={this.props.context.getUrl()}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    );
  }

  /**
   * Prevents default anchor behavior and sets main scene context.
   */
  private handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();
    this.props.views!.redirect(this.props.context);
  };
}
