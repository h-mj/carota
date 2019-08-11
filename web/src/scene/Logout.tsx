import { inject } from "mobx-react";
import { DefaultSceneProps, Scene } from "./Scene";

/**
 * Scene that, when constructed, logs user out after some timeout.
 */
@inject("auth", "views")
export class Logout extends Scene<"Logout"> {
  /**
   * Creates `Logout` scene instance, sets its name and executes `logout`
   * function, that logs user out.
   */
  public constructor(props: DefaultSceneProps<"Logout">) {
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
    const { auth, views } = this.props;

    await views!.load(undefined);

    auth!.logout();
    views!.home();
  }
}
