import * as React from "react";
import { inject, observer } from "mobx-react";
import { Navigation } from "./Navigation";
import { InjectedProps } from "../store/Store";

/**
 * Component responsible for rendering main scene.
 */
@inject("views")
@observer
export class Main extends React.Component<InjectedProps> {
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
