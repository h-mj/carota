import { inject } from "mobx-react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

/**
 * Scene that, when constructed, logs user out after some timeout.
 */
@inject("authenticationStore", "viewStore")
export class Logout extends SceneComponent<"Logout"> {
  /**
   * Creates `Logout` scene instance, sets its name and executes `logout`
   * function, that logs user out.
   */
  public constructor(props: DefaultSceneComponentProps<"Logout">) {
    super("Logout", props);
    this.logout();
  }

  /**
   * Renders nothing.
   */
  public render() {
    return null;
  }

  /**
   * Function that logs user out and redirects to home page after some timeout.
   */
  private async logout() {
    await this.props.viewStore!.load(undefined);

    this.props.authenticationStore!.logout();
    this.props.viewStore!.index();
  }
}
