import * as React from "react";
import { inject, observer } from "mobx-react";
import { Navigation } from "./Navigation";
import { InjectedProps } from "../store/Store";

/**
 * Component responsible for rendering main stage.
 */
@inject("views")
@observer
export class Main extends React.Component<InjectedProps> {
  /**
   * Renders a navigation bar and main stage.
   */
  public render() {
    return (
      <>
        <Navigation />
        {this.props.views!.main.render("main")};
      </>
    );
  }
}
