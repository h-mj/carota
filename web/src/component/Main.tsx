import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { Navigation } from "./Navigation";

/**
 * Component responsible for rendering main scene with navigation bar.
 */
@inject("views")
@observer
export class Main extends Component {
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
