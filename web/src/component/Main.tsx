import * as React from "react";
import { inject, observer } from "mobx-react";
import { Component } from "./Component";
import { Navigation } from "./Navigation";

/**
 * Component responsible for rendering main scene with navigation bar.
 */
@inject("views")
@observer
export class Main extends Component<"Main"> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: {}) {
    super("Main", props);
  }

  /**
   * Renders a navigation bar and main scene components.
   */
  public render() {
    return (
      <>
        <Navigation />
        {this.props.views!.main.render("main")}
      </>
    );
  }
}
